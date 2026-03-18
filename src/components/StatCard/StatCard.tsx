import React from 'react';
import { Icon, IconName } from '../Icon/Icon';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string | React.ReactNode;
  status: string;
  colorTheme: 'blue' | 'teal' | 'amber' | 'green';
  icon: IconName;
  valueColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, status, colorTheme, icon, valueColor }) => {
  return (
    <div className={styles['stat-card']} data-color={colorTheme}>
      <div className={styles['stat-icon']} aria-hidden="true">
        <Icon name={icon} />
      </div>
      <div className={styles['stat-val']} style={{ color: valueColor }}>{value}</div>
      <div className={styles['stat-label']}>{title}</div>
      <div className={styles['stat-sub']}>{status}</div>
    </div>
  );
};
