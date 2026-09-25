import React, { useState } from 'react';

export interface LoginFormProps {
  onSubmitSuccess: (identifier: string) => void;
  onForgotPasswordClick: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmitSuccess,
  onForgotPasswordClick,
}) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [identifierError, setIdentifierError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let valid = true;

    if (!identifier.trim()) {
      setIdentifierError('Email or username is required');
      valid = false;
    } else {
      setIdentifierError(null);
    }

    if (!password) {
      setPasswordError('Password is required');
      valid = false;
    } else {
      setPasswordError(null);
    }

    if (!valid) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSubmitSuccess(identifier.trim());
    }, 800);
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
    >
      <div>
        <label
          htmlFor="login-identifier"
          style={{
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.45rem',
          }}
        >
          Email or Username
        </label>
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <input
            id="login-identifier"
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (identifierError) setIdentifierError(null);
            }}
            placeholder="name@domain.com or username"
            autoComplete="username"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              backgroundColor: 'rgba(31, 41, 55, 0.65)',
              border: `1px solid ${identifierError ? '#ef4444' : 'rgba(255, 255, 255, 0.1)'}`,
              borderRadius: '12px',
              color: 'inherit',
              fontSize: '0.925rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        {identifierError && (
          <span
            style={{
              fontSize: '0.775rem',
              color: '#ef4444',
              marginTop: '0.35rem',
              display: 'block',
            }}
          >
            {identifierError}
          </span>
        )}
      </div>

      <div>
        <label
          htmlFor="login-password"
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
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError(null);
            }}
            placeholder="••••••••"
            autoComplete="current-password"
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
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.85rem',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            style={{
              accentColor: '#6366f1',
              width: '16px',
              height: '16px',
              cursor: 'pointer',
            }}
          />
          <span>Remember me</span>
        </label>
        <button
          type="button"
          onClick={onForgotPasswordClick}
          style={{
            background: 'none',
            border: 'none',
            color: '#6366f1',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: 600,
            textDecoration: 'none',
            padding: 0,
          }}
        >
          Forgot password?
        </button>
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
          transition: 'all 0.2s ease',
        }}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};
