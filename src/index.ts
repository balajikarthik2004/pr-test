export { applyDiscount, formatCents, subtotalCents, totalCents } from './lib/pricing.js';
export type { Discount, LineItem } from './lib/pricing.js';

export { assertValidSku, parseBoundedInt, ValidationError } from './lib/validate.js';

export {
  AuthCard,
  AuthPage,
  ForgotPasswordModal,
  LoginForm,
  PasswordStrengthMeter,
  SignUpForm,
  ToastContainer,
  calculatePasswordStrength,
} from './components/index.js';
export type {
  AuthCardProps,
  AuthMode,
  ForgotPasswordModalProps,
  LoginFormProps,
  PasswordStrengthResult,
  SignUpFormProps,
  ToastMessage,
  ToastProps,
  UserSession,
} from './components/index.js';
