import React, { useState } from 'react';
import { AuthCard } from './AuthCard.js';
import { ForgotPasswordModal } from './ForgotPasswordModal.js';
import { ToastContainer, type ToastMessage } from './Toast.js';

export interface UserSession {
  username: string;
  email: string;
}

export const AuthPage: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [session, setSession] = useState<UserSession | null>(null);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (text: string, type: ToastMessage['type'] = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (identifier: string) => {
    const email = identifier.includes('@') ? identifier : `${identifier}@example.com`;
    const username = identifier.includes('@') ? identifier.split('@')[0]! : identifier;
    setSession({ username, email });
    addToast(`Welcome back, ${username}!`, 'success');
  };

  const handleSignUpSuccess = (username: string, email: string) => {
    setSession({ username, email });
    addToast(`Account created successfully for ${username}!`, 'success');
  };

  const handleSignOut = () => {
    setSession(null);
    addToast('Signed out successfully', 'info');
  };

  const handleSocialClick = (provider: string) => {
    addToast(`Redirecting to ${provider}...`, 'info');
  };

  const handleForgotPasswordSubmit = (email: string) => {
    setIsForgotOpen(false);
    addToast(`Password reset link sent to ${email}`, 'success');
  };

  const isDark = theme === 'dark';
  const bgColor = isDark ? '#0a0f1d' : '#f0f4f8';
  const textColor = isDark ? '#f9fafb' : '#111827';

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: bgColor,
        color: textColor,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        padding: '1.5rem',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
        boxSizing: 'border-box',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Top Header Bar */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 10,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontWeight: 800,
            fontSize: '1.25rem',
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              background:
                'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '1rem',
            }}
          >
            🛡️
          </div>
          <span>AuthGuard</span>
        </div>

        <button
          type="button"
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          style={{
            backgroundColor: 'rgba(31, 41, 55, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'inherit',
            width: '40px',
            height: '40px',
            borderRadius: '9999px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}
          title="Toggle Theme"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </header>

      {/* Main Container */}
      <main
        style={{
          marginTop: '70px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {session ? (
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              backgroundColor: 'var(--bg-card, rgba(17, 24, 39, 0.8))',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              padding: '2.5rem',
              textAlign: 'center',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div
              style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background:
                  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem auto',
                fontSize: '1.75rem',
                color: '#ffffff',
                fontWeight: 700,
              }}
            >
              {session.username.charAt(0).toUpperCase()}
            </div>
            <span
              style={{
                display: 'inline-block',
                padding: '0.3rem 0.75rem',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 600,
                marginBottom: '1rem',
              }}
            >
              Authenticated
            </span>
            <h2 style={{ fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>
              Welcome, {session.username}!
            </h2>
            <p
              style={{
                color: 'var(--text-secondary, #9ca3af)',
                fontSize: '0.9rem',
                marginBottom: '1.75rem',
              }}
            >
              {session.email}
            </p>
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: 'rgba(31, 41, 55, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                color: 'inherit',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <AuthCard
            onLoginSuccess={handleLoginSuccess}
            onSignUpSuccess={handleSignUpSuccess}
            onForgotPasswordClick={() => setIsForgotOpen(true)}
            onSocialClick={handleSocialClick}
          />
        )}
      </main>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSubmit={handleForgotPasswordSubmit}
      />

      {/* Toast Alerts */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};
