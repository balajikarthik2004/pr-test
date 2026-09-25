import React from 'react';

export interface PasswordStrengthResult {
  score: number;
  label: string;
  hasLength: boolean;
  hasMixedCase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasMixedCase = hasUpper && hasLower;
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/.test(password);

  let score = 0;
  if (hasLength) score += 1;
  if (hasMixedCase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecial) score += 1;

  let label = 'Enter password';
  if (password.length > 0) {
    if (score <= 1) label = 'Weak';
    else if (score === 2) label = 'Fair';
    else if (score === 3) label = 'Good';
    else label = 'Strong';
  }

  return {
    score,
    label,
    hasLength,
    hasMixedCase,
    hasNumber,
    hasSpecial,
  };
}

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
}) => {
  const strength = calculatePasswordStrength(password);

  const getSegmentColor = (index: number): string => {
    if (password.length === 0) return 'rgba(255, 255, 255, 0.1)';
    if (index >= strength.score) return 'rgba(255, 255, 255, 0.1)';

    if (strength.score === 1) return '#ef4444';
    if (strength.score === 2) return '#f59e0b';
    if (strength.score === 3) return '#3b82f6';
    return '#10b981';
  };

  const getLabelColor = (): string => {
    if (password.length === 0) return 'var(--text-muted, #6b7280)';
    if (strength.score === 1) return '#ef4444';
    if (strength.score === 2) return '#f59e0b';
    if (strength.score === 3) return '#3b82f6';
    return '#10b981';
  };

  return (
    <div
      style={{
        marginTop: '0.65rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
      }}
    >
      <div
        style={{
          height: '4px',
          background: 'rgba(31, 41, 55, 0.65)',
          borderRadius: '9999px',
          display: 'flex',
          gap: '4px',
          overflow: 'hidden',
        }}
      >
        {[0, 1, 2, 3].map((idx) => (
          <div
            key={idx}
            style={{
              flex: 1,
              height: '100%',
              backgroundColor: getSegmentColor(idx),
              borderRadius: '9999px',
              transition: 'background-color 0.3s ease',
            }}
          />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted, #9ca3af)',
        }}
      >
        <span>Strength:</span>
        <span style={{ fontWeight: 600, color: getLabelColor() }}>{strength.label}</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '0.35rem',
          marginTop: '0.35rem',
          fontSize: '0.725rem',
        }}
      >
        <span
          style={{
            color: strength.hasLength ? '#10b981' : 'var(--text-muted, #6b7280)',
          }}
        >
          {strength.hasLength ? '✓' : '•'} 8+ Characters
        </span>
        <span
          style={{
            color: strength.hasMixedCase ? '#10b981' : 'var(--text-muted, #6b7280)',
          }}
        >
          {strength.hasMixedCase ? '✓' : '•'} Mixed Case (A-z)
        </span>
        <span
          style={{
            color: strength.hasNumber ? '#10b981' : 'var(--text-muted, #6b7280)',
          }}
        >
          {strength.hasNumber ? '✓' : '•'} Number (0-9)
        </span>
        <span
          style={{
            color: strength.hasSpecial ? '#10b981' : 'var(--text-muted, #6b7280)',
          }}
        >
          {strength.hasSpecial ? '✓' : '•'} Special Symbol
        </span>
      </div>
    </div>
  );
};
