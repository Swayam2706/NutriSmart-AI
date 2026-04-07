import { Toaster } from 'react-hot-toast';

/**
 * Global toast notification container.
 * Place once in App root. Use toast() from 'react-hot-toast' anywhere.
 */
const Toast = () => (
  <Toaster
    position="top-right"
    gutter={10}
    toastOptions={{
      duration: 3500,
      style: {
        background: 'var(--toast-bg, #1e293b)',
        color: '#f1f5f9',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.08)',
        fontSize: '14px',
        fontWeight: '500',
        padding: '12px 16px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      },
      success: {
        iconTheme: { primary: '#10b981', secondary: '#fff' },
      },
      error: {
        iconTheme: { primary: '#ef4444', secondary: '#fff' },
      },
    }}
  />
);

export default Toast;
