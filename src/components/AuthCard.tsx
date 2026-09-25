import React, { useState } from 'react';
import { LoginForm } from './LoginForm.js';
import { SignUpForm } from './SignUpForm.js';

export type AuthMode = 'login' | 'signup';

export interface AuthCardProps {
  onLoginSuccess: (identifier: string) => void;
  onSignUpSuccess: (username: string, email: string) => void;
  onForgotPasswordClick: () => void;
  onSocialClick: (provider: string) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  onLoginSuccess,
  onSignUpSuccess,
  onForgotPasswordClick,
  onSocialClick,
}) => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '460px',
        backgroundColor: 'var(--bg-card, rgba(17, 24, 39, 0.8))',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '2.25rem',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h1>
        <p
          style={{
            color: 'var(--text-secondary, #9ca3af)',
            fontSize: '0.925rem',
            margin: 0,
          }}
        >
          {mode === 'login'
            ? 'Enter your credentials to access your account'
            : 'Join in seconds and start building'}
        </p>
      </div>

      {/* Segmented Switcher */}
      <div
        style={{
          display: 'flex',
          position: 'relative',
          backgroundColor: 'rgba(31, 41, 55, 0.65)',
          padding: '4px',
          borderRadius: '12px',
          marginBottom: '1.75rem',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <button
          type="button"
          onClick={() => setMode('login')}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            background:
              mode === 'login'
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: mode === 'login' ? '#ffffff' : 'var(--text-secondary, #9ca3af)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setMode('signup')}
          style={{
            flex: 1,
            padding: '0.65rem 1rem',
            background:
              mode === 'signup'
                ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: mode === 'signup' ? '#ffffff' : 'var(--text-secondary, #9ca3af)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
          }}
        >
          Create Account
        </button>
      </div>

      {/* Social Providers */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.75rem',
          }}
        >
          {['Google', 'GitHub', 'Apple'].map((provider) => (
            <button
              key={provider}
              type="button"
              onClick={() => onSocialClick(provider)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.7rem',
                backgroundColor: 'rgba(31, 41, 55, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'inherit',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {provider}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center',
            margin: '1.5rem 0',
            color: 'var(--text-muted, #6b7280)',
            fontSize: '0.8rem',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          <div
            style={{
              flex: 1,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          />
          <span style={{ padding: '0 0.85rem' }}>Or continue with email</span>
          <div
            style={{
              flex: 1,
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          />
        </div>
      </div>

      {mode === 'login' ? (
        <LoginForm
          onSubmitSuccess={onLoginSuccess}
          onForgotPasswordClick={onForgotPasswordClick}
        />
      ) : (
        <SignUpForm onSubmitSuccess={onSignUpSuccess} />
      )}
    </div>
  );
};
