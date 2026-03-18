import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import styles from '../components/Toast/Toast.module.css';

export type ToastType = 'ok' | 'info' | 'warn' | 'err';

interface Toast {
  id: string;
  msg: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (msg: string, type?: ToastType, delay?: number) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((msg: string, type: ToastType = 'info', delay: number = 0) => {
    setTimeout(() => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, msg, type }]);
      
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3500);
    }, delay);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className={styles['toast-container']} aria-live="polite" aria-atomic="false">
          <AnimatePresence>
            {toasts.map((toast) => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: '120%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '120%' }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={`${styles.toast} ${styles[toast.type]}`}
              >
                <span className={styles['toast-dot']} />
                <span>{toast.msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body
      )}
    </ToastContext.Provider>
  );
};
