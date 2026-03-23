import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import styles from './Modal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  label: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  profile?: {
    initials: string;
    name: string;
    role: string;
    chips: { label: string; color: 'green' | 'blue' | 'amber' }[];
  };
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, label, children, footer, profile }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
      // Focus the first element slightly after mount
      setTimeout(() => {
        const closeBtn = modalRef.current?.querySelector(`.${styles['modal-close']}`) as HTMLElement;
        closeBtn?.focus();
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          key="modal-overlay"
          className={styles['modal-overlay']}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className={styles['modal-card']}
            ref={modalRef}
            initial={{ y: 20, scale: 0.97 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 20, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ willChange: 'auto' }}
          >
            <button className={styles['modal-close']} onClick={onClose} aria-label="Tutup">×</button>
            
            <div className={styles['modal-head']}>
              <div className={styles['modal-label']}>{label}</div>
              
              {profile && (
                <div className={styles['modal-profile']}>
                  <div className={styles['modal-avatar']} aria-hidden="true">{profile.initials}</div>
                  <div>
                    <div className={styles['modal-name']}>{profile.name}</div>
                    <div className={styles['modal-role']}>{profile.role}</div>
                    <div className={styles['modal-chips']}>
                      {profile.chips.map((chip, i) => (
                        <span key={i} className={`${styles['modal-chip']} ${styles[chip.color]}`}>
                          {chip.color === 'green' ? '● ' : ''}{chip.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <dl className={styles['modal-fields']}>
              {children}
            </dl>
            
            {footer && (
              <div className={styles['modal-footer']}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
