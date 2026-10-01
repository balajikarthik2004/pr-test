#!/usr/bin/env bash
# Configure the `production` environment that gates deploy-production.yml.
#
#   ./scripts/setup-environments.sh <owner/repo> <reviewer[,reviewer...]> [wait_minutes]
#   ./scripts/setup-environments.sh <owner/repo> --check
#
# Examples:
#   ./scripts/setup-environments.sh balajikarthik2004/pr-test alice,bob
#   ./scripts/setup-environments.sh myorg/svc alice,myorg/platform-team 10
#   ./scripts/setup-environments.sh myorg/svc --check
#
# A reviewer is a GitHub username, or `org/team-slug` for a team.
#
# WHY THIS IS A SCRIPT AND NOT A FILE
# Required reviewers live in repository settings, not in the repo. A workflow
# that says `environment: production` against an environment that does not
# exist, or that has no reviewers, runs IMMEDIATELY and approves nothing. The
# gate looks present in the YAML and is not there. Always finish with --check.
#
# REQUIREMENTS
#   gh auth login  (scope: repo)
#   Admin on the repository.
#   Required reviewers on a PRIVATE repo need GitHub Pro / Team / Enterprise.
#   They are free on public repos. On a free private repo the environment is
#   created but the protection rules are silently dropped - --check catches it.
#
# Run this in Git Bash on Windows, not PowerShell.
set -euo pipefail

REPO="${1:-}"
ARG2="${2:-}"
WAIT_MINUTES="${3:-0}"
ENV_NAME="production"

if [ -z "$REPO" ] || [ -z "$ARG2" ]; then
  echo "usage: $0 <owner/repo> <reviewer[,reviewer...]> [wait_minutes]" >&2
  echo "       $0 <owner/repo> --check" >&2
  exit 2
fi

check_env() {
  local repo="$1" rules reviewers policy selfreview bypass
  echo "Checking the '${ENV_NAME}' environment on ${repo}..."
  echo

  if ! gh api "repos/${repo}/environments/${ENV_NAME}" >/dev/null 2>&1; then
    echo "  NOT CONFIGURED: there is no '${ENV_NAME}' environment." >&2
    echo "  deploy-production.yml would run with NO approval step." >&2
    return 1
  fi

  # A team reviewer has .slug, a user has .login - take whichever is present.
  rules=$(gh api "repos/${repo}/environments/${ENV_NAME}" \
            --jq '[.protection_rules[].type] | join(", ")' 2>/dev/null || echo '')
  reviewers=$(gh api "repos/${repo}/environments/${ENV_NAME}" \
            --jq '[.protection_rules[]? | select(.type=="required_reviewers") | .reviewers[]?.reviewer | (.login // .slug // .name)] | join(", ")' 2>/dev/null || echo '')
  policy=$(gh api "repos/${repo}/environments/${ENV_NAME}" \
            --jq '.deployment_branch_policy.protected_branches' 2>/dev/null || echo 'null')
  selfreview=$(gh api "repos/${repo}/environments/${ENV_NAME}" \
            --jq '[.protection_rules[]? | select(.type=="required_reviewers") | .prevent_self_review] | first' 2>/dev/null || echo 'null')

  bypass=$(gh api "repos/${repo}/environments/${ENV_NAME}" \
            --jq '.can_admins_bypass' 2>/dev/null || echo 'null')

  echo "  environment exists : yes"
  echo "  protection rules   : ${rules:-(none)}"
  echo "  required reviewers : ${reviewers:-(none)}"
  echo "  prevent self review: ${selfreview:-null}"
  echo "  admins can bypass  : ${bypass:-null}"
  echo "  protected branches : ${policy:-null}"
  echo

  if [ "$bypass" = "true" ]; then
    echo "  WARNING: admins can bypass this approval, so it is advisory for them." >&2
    echo "  Re-run this script (without --check) to set can_admins_bypass=false." >&2
    echo >&2
  fi

  if [ -z "${reviewers// /}" ]; then
    echo "  FAIL: no required reviewers. The deploy job will NOT pause." >&2
    echo "  On a free plan with a private repo GitHub drops this rule silently." >&2
    echo "  Make the repo public, or upgrade the plan." >&2
    return 1
  fi

  echo "  OK: production deploys will wait for approval from: ${reviewers}"
  return 0
}

# --------------------------------------------------------------------- check
if [ "$ARG2" = "--check" ]; then
  check_env "$REPO"
  exit $?
fi

# --------------------------------------------------------------------- apply
echo "Resolving reviewers..."
REVIEWER_ITEMS=""
IFS=',' read -ra ENTRIES <<< "$ARG2"
for entry in "${ENTRIES[@]}"; do
  entry="$(echo "$entry" | tr -d '[:space:]')"
  [ -z "$entry" ] && continue

  if [[ "$entry" == */* ]]; then
    ORG="${entry%%/*}"; TEAM="${entry##*/}"
    if ! ID=$(gh api "orgs/${ORG}/teams/${TEAM}" --jq .id 2>/dev/null); then
      echo "ERROR: team '${entry}' not found, or you cannot see it." >&2
      exit 1
    fi
    echo "  team ${entry} -> ${ID}"
    ITEM="{\"type\":\"Team\",\"id\":${ID}}"
  else
    if ! ID=$(gh api "users/${entry}" --jq .id 2>/dev/null); then
      echo "ERROR: user '${entry}' not found." >&2
      exit 1
    fi
    echo "  user ${entry} -> ${ID}"
    ITEM="{\"type\":\"User\",\"id\":${ID}}"
  fi

  if [ -z "$REVIEWER_ITEMS" ]; then
    REVIEWER_ITEMS="$ITEM"
  else
    REVIEWER_ITEMS="${REVIEWER_ITEMS},${ITEM}"
  fi
done

if [ -z "$REVIEWER_ITEMS" ]; then
  echo "ERROR: no valid reviewers resolved." >&2
  exit 1
fi

echo
echo "Applying '${ENV_NAME}' protection to ${REPO} (wait timer: ${WAIT_MINUTES}m)"

# prevent_self_review stops the person who triggered the deploy approving it.
# Note: with a single reviewer that makes THEIR OWN deploys unapprovable, which
# is correct but will surprise you in a one-person sandbox - pass two reviewers,
# or accept that you must trigger from a different account.
#
# deployment_branch_policy.protected_branches limits production deploys to
# branches that have branch protection, so nobody deploys a feature branch.
# can_admins_bypass=false is what makes this a gate rather than a suggestion.
# Left at GitHub's default (true), a repo admin can deploy without the approval
# and the whole workflow becomes decorative. Turning it off means an admin is
# bound by the same rule as everyone else - which is the point.
#
# Consequence to accept deliberately: with one reviewer who is unavailable,
# nobody can deploy. Configure at least two.
cat <<JSON | gh api -X PUT "repos/${REPO}/environments/${ENV_NAME}" --input - >/dev/null
{
  "wait_timer": ${WAIT_MINUTES},
  "prevent_self_review": true,
  "can_admins_bypass": false,
  "reviewers": [${REVIEWER_ITEMS}],
  "deployment_branch_policy": {
    "protected_branches": true,
    "custom_branch_policies": false
  }
}
JSON

echo "Applied."
echo
check_env "$REPO"
