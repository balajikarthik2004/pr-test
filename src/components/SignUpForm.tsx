import React, { useState } from 'react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter.js';

export interface SignUpFormProps {
  onSubmitSuccess: (username: string, email: string) => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ onSubmitSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [termsError, setTermsError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    if (!username.trim() || username.trim().length < 3 || username.trim().length > 30) {
      setUsernameError('Username must be between 3 and 30 characters');
      valid = false;
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username.trim())) {
      setUsernameError(
        'Username can only contain letters, numbers, and hyphens/underscores',
      );
      valid = false;
    } else {
      setUsernameError(null);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError(null);
    }

    if (!password || password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      valid = false;
    } else {
      setPasswordError(null);
    }

    if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    } else {
      setConfirmError(null);
    }

    if (!agreeTerms) {
      setTermsError('You must accept the terms and conditions');
      valid = false;
    } else {
      setTermsError(null);
    }

    if (!valid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubmitSuccess(username.trim(), email.trim());
    }, 1000);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}
    >
      <div>
        <label
          htmlFor="signup-username"
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.45rem',
          }}
        >
          Username
        </label>
        <input
          id="signup-username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (usernameError) setUsernameError(null);
          }}
          placeholder="e.g. alex_dev"
          autoComplete="username"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(31, 41, 55, 0.65)',
            border: `1px solid ${usernameError ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '12px',
            color: 'inherit',
            fontSize: '0.925rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {usernameError && (
          <span
            style={{
              fontSize: '0.775rem',
              color: '#ef4444',
              marginTop: '0.35rem',
              display: 'block',
            }}
          >
            {usernameError}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="signup-email"
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.45rem',
          }}
        >
          Work / Personal Email
        </label>
        <input
          id="signup-email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (emailError) setEmailError(null);
          }}
          placeholder="alex@company.com"
          autoComplete="email"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(31, 41, 55, 0.65)',
            border: `1px solid ${emailError ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '12px',
            color: 'inherit',
            fontSize: '0.925rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {emailError && (
          <span
            style={{
              fontSize: '0.775rem',
              color: '#ef4444',
              marginTop: '0.35rem',
              display: 'block',
            }}
          >
            {emailError}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="signup-password"
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.45rem',
          }}
        >
          Password
        </label>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            style={{
              width: '100%',
              padding: '0.75rem 2.75rem 0.75rem 1rem',
              backgroundColor: 'rgba(31, 41, 55, 0.65)',
              border: `1px solid ${passwordError ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '12px',
              color: 'inherit',
              fontSize: '0.925rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            aria-label="Toggle password visibility"
            style={{
              position: 'absolute',
              right: '0.75rem',
              background: 'none',
              border: 'none',
              color: 'var(--text-muted, #9ca3af)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: '0.25rem',
            }}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {passwordError && (
          <span
            style={{
              fontSize: '0.775rem',
              color: '#ef4444',
              marginTop: '0.35rem',
              display: 'block',
            }}
          >
            {passwordError}
          </span>
        )}
        <PasswordStrengthMeter password={password} />
      </div>

      <div>
        <label
          htmlFor="signup-confirm-password"
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.45rem',
          }}
        >
          Confirm Password
        </label>
        <input
          id="signup-confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (confirmError) setConfirmError(null);
          }}
          placeholder="Re-enter password"
          autoComplete="new-password"
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(31, 41, 55, 0.65)',
            border: `1px solid ${confirmError ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
            borderRadius: '12px',
            color: 'inherit',
            fontSize: '0.925rem',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {confirmError && (
          <span
            style={{
              fontSize: '0.775rem',
              color: '#ef4444',
              marginTop: '0.35rem',
              display: 'block',
            }}
          >
            {confirmError}
          </span>
        )}
      </div>

      <div>
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.85rem',
          }}
        >
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (termsError) setTermsError(null);
            }}
            style={{
              accentColor: '#6366f1',
              width: '16px',
              height: '16px',
              cursor: 'pointer',
            }}
          />
          <span>
            I agree to the{' '}
            <span style={{ color: '#6366f1', fontWeight: 600 }}>Terms</span> and{' '}
            <span style={{ color: '#6366f1', fontWeight: 600 }}>Privacy Policy</span>
          </span>
        </label>
        {termsError && (
          <span
            style={{
              fontSize: '0.775rem',
              color: '#ef4444',
              marginTop: '0.35rem',
              display: 'block',
            }}
          >
            {termsError}
          </span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          width: '100%',
          padding: '0.85rem 1.5rem',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          border: 'none',
          borderRadius: '12px',
          color: '#ffffff',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 15px rgba(99, 102, 241, 0.35)',
          opacity: isLoading ? 0.7 : 1,
          marginTop: '0.5rem',
          transition: 'all 0.2s ease',
        }}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
};
