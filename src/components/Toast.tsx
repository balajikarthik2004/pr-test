import React from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

export interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '1.5rem',
        right: '1.5rem',
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((t) => {
        const borderColor =
          t.type === 'success' ? '#10b981' : t.type === 'error' ? '#ef4444' : '#6366f1';

        return (
          <div
            key={t.id}
            onClick={() => onDismiss(t.id)}
            style={{
              backgroundColor: 'var(--bg-secondary, #111827)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderLeft: `4px solid ${borderColor}`,
              borderRadius: '12px',
              padding: '0.85rem 1.25rem',
              color: '#f9fafb',
              fontSize: '0.875rem',
              fontWeight: 500,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
              cursor: 'pointer',
              pointerEvents: 'auto',
              minWidth: '280px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
            }}
          >
            <span>{t.text}</span>
            <span style={{ opacity: 0.5, fontSize: '1.1rem' }}>&times;</span>
          </div>
        );
      })}
    </div>
  );
};
