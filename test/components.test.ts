import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';
import {
  PasswordStrengthMeter,
  calculatePasswordStrength,
} from '../src/components/PasswordStrengthMeter.js';
import { LoginForm } from '../src/components/LoginForm.js';
import { SignUpForm } from '../src/components/SignUpForm.js';
import { ForgotPasswordModal } from '../src/components/ForgotPasswordModal.js';
import { ToastContainer } from '../src/components/Toast.js';
import { AuthCard } from '../src/components/AuthCard.js';
import { AuthPage } from '../src/components/AuthPage.js';

describe('calculatePasswordStrength helper', () => {
  it('handles empty password', () => {
    const res = calculatePasswordStrength('');
    expect(res.score).toBe(0);
    expect(res.label).toBe('Enter password');
    expect(res.hasLength).toBe(false);
  });

  it('handles weak password', () => {
    const res = calculatePasswordStrength('short');
    expect(res.score).toBe(0);
    expect(res.label).toBe('Weak');
  });

  it('handles fair password with 8 chars and mixed case', () => {
    const res = calculatePasswordStrength('Abcdefgh');
    expect(res.score).toBe(2);
    expect(res.label).toBe('Fair');
    expect(res.hasLength).toBe(true);
    expect(res.hasMixedCase).toBe(true);
  });

  it('handles good password with 8 chars, mixed case, and number', () => {
    const res = calculatePasswordStrength('Abcdefg1');
    expect(res.score).toBe(3);
    expect(res.label).toBe('Good');
    expect(res.hasNumber).toBe(true);
    expect(res.hasSpecial).toBe(false);
  });

  it('handles strong password with all requirements met', () => {
    const res = calculatePasswordStrength('Abcdefg1!');
    expect(res.score).toBe(4);
    expect(res.label).toBe('Strong');
    expect(res.hasSpecial).toBe(true);
  });
});

describe('React Components Rendering', () => {
  it('renders PasswordStrengthMeter for empty, weak, fair, good, strong', () => {
    expect(
      renderToStaticMarkup(React.createElement(PasswordStrengthMeter, { password: '' })),
    ).toContain('Enter password');
    expect(
      renderToStaticMarkup(
        React.createElement(PasswordStrengthMeter, { password: 'short' }),
      ),
    ).toContain('Weak');
    expect(
      renderToStaticMarkup(
        React.createElement(PasswordStrengthMeter, { password: 'Abcdefgh' }),
      ),
    ).toContain('Fair');
    expect(
      renderToStaticMarkup(
        React.createElement(PasswordStrengthMeter, { password: 'Abcdefg1' }),
      ),
    ).toContain('Good');
    expect(
      renderToStaticMarkup(
        React.createElement(PasswordStrengthMeter, { password: 'Abcdefg1!' }),
      ),
    ).toContain('Strong');
  });

  it('renders LoginForm component', () => {
    const html = renderToStaticMarkup(
      React.createElement(LoginForm, {
        onSubmitSuccess: () => {},
        onForgotPasswordClick: () => {},
      }),
    );
    expect(html).toContain('Email or Username');
    expect(html).toContain('Sign In');
  });

  it('renders SignUpForm component', () => {
    const html = renderToStaticMarkup(
      React.createElement(SignUpForm, {
        onSubmitSuccess: () => {},
      }),
    );
    expect(html).toContain('Work / Personal Email');
    expect(html).toContain('Create Account');
  });

  it('renders ForgotPasswordModal open and closed', () => {
    const closedHtml = renderToStaticMarkup(
      React.createElement(ForgotPasswordModal, {
        isOpen: false,
        onClose: () => {},
        onSubmit: () => {},
      }),
    );
    expect(closedHtml).toBe('');

    const openHtml = renderToStaticMarkup(
      React.createElement(ForgotPasswordModal, {
        isOpen: true,
        onClose: () => {},
        onSubmit: () => {},
      }),
    );
    expect(openHtml).toContain('Reset Password');
  });

  it('renders ToastContainer with multiple toast types', () => {
    const emptyHtml = renderToStaticMarkup(
      React.createElement(ToastContainer, {
        toasts: [],
        onDismiss: () => {},
      }),
    );
    expect(emptyHtml).toBe('');

    const toastHtml = renderToStaticMarkup(
      React.createElement(ToastContainer, {
        toasts: [
          { id: '1', type: 'success', text: 'Success message' },
          { id: '2', type: 'error', text: 'Error message' },
          { id: '3', type: 'info', text: 'Info message' },
        ],
        onDismiss: () => {},
      }),
    );
    expect(toastHtml).toContain('Success message');
    expect(toastHtml).toContain('Error message');
    expect(toastHtml).toContain('Info message');
  });

  it('renders AuthCard and AuthPage', () => {
    const cardHtml = renderToStaticMarkup(
      React.createElement(AuthCard, {
        onLoginSuccess: () => {},
        onSignUpSuccess: () => {},
        onForgotPasswordClick: () => {},
        onSocialClick: () => {},
      }),
    );
    expect(cardHtml).toContain('Welcome Back');

    const pageHtml = renderToStaticMarkup(React.createElement(AuthPage));
    expect(pageHtml).toContain('AuthGuard');
  });
});
