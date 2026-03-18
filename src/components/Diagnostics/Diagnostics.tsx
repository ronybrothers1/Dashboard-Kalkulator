import React, { useState, useEffect } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './Diagnostics.module.css';

export const Diagnostics = React.memo(() => {
  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);
  const [threat, setThreat] = useState(0);
  const [bars, setBars] = useState<number[]>(Array(28).fill(12));

  useEffect(() => {
    // Initial animation
    const timeout1 = setTimeout(() => {
      setCpu(62);
      setRam(78);
      setThreat(23);
    }, 850);

    const animBars = () => {
      setBars(Array(28).fill(0).map(() => 12 + Math.random() * 88));
    };
    
    const timeout2 = setTimeout(animBars, 900);
    const interval = setInterval(animBars, 1400);

    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className={styles['diag-panel']}>
      <div className={styles['panel-header']}>
        <div className={styles['panel-header-title']}>
          <Icon name="diag" />
          Diagnostik
        </div>
        <div className={styles['panel-header-sub']}>REALTIME</div>
      </div>
      <div className={styles['diag-body']}>
        <div className={styles['diag-item']}>
          <div className={styles['diag-top']}>
            <span className={styles['diag-name']}>CPU Load</span>
            <span className={`${styles['diag-val']} ${styles.blue}`} aria-live="polite">{cpu || '—'}%</span>
          </div>
          <div className={styles['diag-track']} role="progressbar" aria-valuenow={cpu} aria-valuemin={0} aria-valuemax={100} aria-label="CPU load bar">
            <div className={`${styles['diag-fill']} ${styles.blue}`} style={{ width: `${cpu}%` }}></div>
          </div>
        </div>
        <div className={styles['diag-item']}>
          <div className={styles['diag-top']}>
            <span className={styles['diag-name']}>Memory</span>
            <span className={`${styles['diag-val']} ${styles.amber}`} aria-live="polite">{ram || '—'}%</span>
          </div>
          <div className={styles['diag-track']} role="progressbar" aria-valuenow={ram} aria-valuemin={0} aria-valuemax={100} aria-label="Memory usage bar">
            <div className={`${styles['diag-fill']} ${styles.amber}`} style={{ width: `${ram}%` }}></div>
          </div>
        </div>
        <div className={styles['diag-item']}>
          <div className={styles['diag-top']}>
            <span className={styles['diag-name']}>Threat Level</span>
            <span className={`${styles['diag-val']} ${styles.green}`} aria-live="polite">{threat || '—'}%</span>
          </div>
          <div className={styles['diag-track']} role="progressbar" aria-valuenow={threat} aria-valuemin={0} aria-valuemax={100} aria-label="Threat level bar">
            <div className={`${styles['diag-fill']} ${styles.green}`} style={{ width: `${threat}%` }}></div>
          </div>
        </div>
      </div>
      <div className={styles['signal-panel']}>
        <div className={styles['signal-label']}>Signal Trace</div>
        <div className={styles['signal-bars']} aria-hidden="true">
          {bars.map((h, i) => (
            <div 
              key={i} 
              className={styles['signal-bar']} 
              style={{ 
                height: `${h}%`,
                background: h > 70 ? 'rgba(255,181,71,0.30)' : h > 40 ? 'rgba(45,142,255,0.22)' : 'rgba(0,212,180,0.18)'
              }} 
            />
          ))}
        </div>
      </div>
    </div>
  );
});
