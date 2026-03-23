import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './LogPanel.module.css';
import { motion, AnimatePresence } from 'motion/react';

interface LogEntry {
  id: number;
  cls: 'ok' | 'info' | 'warn' | 'err';
  ts: string;
  delay: number;
  txt: string;
}

const INITIAL_LOGS: LogEntry[] = [
  { id: 1, cls: 'ok', ts: '09:41:02', delay: 200, txt: '[OK]   Kernel v5.15.0-rony loaded' },
  { id: 2, cls: 'ok', ts: '09:41:03', delay: 450, txt: '[OK]   Auth module initialized' },
  { id: 3, cls: 'info', ts: '09:41:03', delay: 700, txt: '[INFO] Scanning identity: Rony Brothers …' },
  { id: 4, cls: 'err', ts: '09:41:04', delay: 970, txt: '[WARN] Trace signal detected — mitigated' },
  { id: 5, cls: 'ok', ts: '09:41:05', delay: 1240, txt: '[OK]   Profile verified — access granted' },
  { id: 6, cls: 'warn', ts: '09:41:05', delay: 1520, txt: '[AUTH] Clearance Level 5 — portal ready' }
];

export const LogPanel: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];
    
    INITIAL_LOGS.forEach((log) => {
      const timeout = setTimeout(() => {
        setLogs((prev) => [...prev, log]);
      }, log.delay);
      timeouts.push(timeout);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className={styles['log-panel']}>
      <div className={styles['panel-header']}>
        <div className={styles['panel-header-title']}>
          <Icon name="log" />
          Log Sistem
        </div>
        <div className={styles['panel-header-sub']}>LIVE · AES-256</div>
      </div>
      <div className={styles['log-body']} aria-live="polite" aria-label="Log sistem">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
              className={`${styles['log-line']} ${styles[log.cls]}`}
              style={{ willChange: 'auto' }}
            >
              <span className={styles['log-ts']}>{log.ts}</span>
              <span className={styles['log-msg']}>{log.txt}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
