import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/StatCard/StatCard';
import { LogPanel } from '../../components/LogPanel/LogPanel';
import { Diagnostics } from '../../components/Diagnostics/Diagnostics';
import { Icon } from '../../components/Icon/Icon';
import styles from './Dashboard.module.css';

export const Dashboard: React.FC = () => {
  const [ip, setIp] = useState('Resolving…');
  const [promptText, setPromptText] = useState('');
  const fullPrompt = 'init --portal=rony-brothers --enc=aes256';
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const ipTimeout = setTimeout(() => {
      setIp(`10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 254) + 1}`);
    }, 1200);

    const promptTimeout = setTimeout(() => {
      let i = 0;
      const iv = setInterval(() => {
        if (i < fullPrompt.length) {
          setPromptText(fullPrompt.substring(0, i + 1));
          i++;
        } else {
          clearInterval(iv);
          setTimeout(() => setShowNav(true), 300);
        }
      }, 42);
      return () => clearInterval(iv);
    }, 1500);

    return () => {
      clearTimeout(ipTimeout);
      clearTimeout(promptTimeout);
    };
  }, []);

  return (
    <>
      <section className={styles['hero-welcome']} aria-label="Sambutan">
        <div className={styles['hero-eyebrow']} aria-hidden="true">Portal Akses Terpusat</div>
        <h1 className={styles['hero-title']}>Selamat Datang, <span>Rony Brothers</span></h1>
        <p className={styles['hero-sub']}>Sistem portal resmi · terenkripsi · terverifikasi · v2.4.1</p>
      </section>

      <div className={styles['prompt-panel']} role="log" aria-label="Terminal prompt">
        <span className={styles['prompt-dollar']} aria-hidden="true">$</span>
        <span className={styles['prompt-text']}>
          {promptText}
          <span className={styles['cursor-blink']} aria-hidden="true" />
        </span>
      </div>

      <section className={styles['stat-row']} aria-label="Statistik sistem">
        <StatCard title="Clearance" value="LV5" status="ACCESS GRANTED" colorTheme="blue" icon="shield" />
        <StatCard title="Enkripsi" value="AES" status="256-GCM AKTIF" colorTheme="teal" icon="lock" />
        <StatCard title="CPU Load" value="62%" status="NORMAL" colorTheme="amber" icon="cpu" />
        <StatCard title="Status" value="●" status="SISTEM AKTIF" colorTheme="green" icon="status" valueColor="var(--green)" />
      </section>

      <div className={styles['main-grid']}>
        <section aria-label="Identitas dan navigasi">
          <div className={styles['id-card']} role="region" aria-label="Kartu identitas">
            <div className={styles['id-card-head']}>
              <div className={styles['id-card-label']}>Kartu Identitas · Node Resmi</div>
              <div className={styles['id-profile']}>
                <div className={styles['id-avatar']}>
                  <img
                    src="https://drive.google.com/thumbnail?id=1PtZLglvYL7J-LChzozokAfFqpdNTOEvD&sz=w200"
                    alt="Foto Profil Rony Brothers"
                    width="56" height="56" loading="eager"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                      (e.target as HTMLImageElement).nextElementSibling!.setAttribute('style', 'display:flex');
                    }}
                  />
                  <div className={styles['id-avatar-fallback']} style={{ display: 'none' }} aria-hidden="true">RB</div>
                </div>
                <div>
                  <div className={styles['id-info-name']}>Rony Brothers</div>
                  <div className={styles['id-info-role']}>Administrator · Portal Resmi</div>
                  <div className={styles['id-chips']} aria-label="Status dan badge">
                    <span className={`${styles['id-chip']} ${styles.green}`}>● Aktif</span>
                    <span className={`${styles['id-chip']} ${styles.blue}`}>Clearance Lv.5</span>
                    <span className={`${styles['id-chip']} ${styles.amber}`}>Terverifikasi</span>
                  </div>
                </div>
              </div>
            </div>
            <dl className={styles['id-fields']}>
              <div className={styles['id-field']}>
                <dt className={styles['id-field-key']}>Status</dt>
                <dd className={`${styles['id-field-val']} ${styles.accent}`}>Aktif</dd>
              </div>
              <div className={styles['id-field']}>
                <dt className={styles['id-field-key']}>Clearance</dt>
                <dd className={`${styles['id-field-val']} ${styles.amber}`}>Level 5</dd>
              </div>
              <div className={styles['id-field']}>
                <dt className={styles['id-field-key']}>Node IP</dt>
                <dd className={`${styles['id-field-val']} ${styles.mono}`}>{ip}</dd>
              </div>
              <div className={styles['id-field']}>
                <dt className={styles['id-field-key']}>Enkripsi</dt>
                <dd className={`${styles['id-field-val']} ${styles.mono}`}>AES-256</dd>
              </div>
            </dl>
          </div>

          <nav 
            className={styles['nav-cards']} 
            style={{ opacity: showNav ? 1 : 0, pointerEvents: showNav ? 'auto' : 'none', transition: 'opacity 0.5s ease' }} 
            aria-label="Navigasi portal"
          >
            <a href="https://www.rony.biz.id/profil" className={styles['nav-card']} data-color="blue" aria-label="Akses halaman Profil" rel="noopener noreferrer">
              <div className={styles['nav-card-icon']} aria-hidden="true">
                <Icon name="profile" />
              </div>
              <div className={styles['nav-card-body']}>
                <div className={styles['nav-card-tag']}>Node · 01 · Identity</div>
                <div className={styles['nav-card-title']}>Profil</div>
                <div className={styles['nav-card-desc']}>About me · Portfolio · Kontak</div>
              </div>
              <div className={styles['nav-card-arrow']} aria-hidden="true">
                <Icon name="arrow-right" />
              </div>
            </a>

            <a href="https://www.rony.biz.id/tools" className={styles['nav-card']} data-color="teal" aria-label="Akses halaman Tool" rel="noopener noreferrer">
              <div className={styles['nav-card-icon']} aria-hidden="true">
                <Icon name="tools" />
              </div>
              <div className={styles['nav-card-body']}>
                <div className={styles['nav-card-tag']}>Node · 02 · Utilities</div>
                <div className={styles['nav-card-title']}>Tool</div>
                <div className={styles['nav-card-desc']}>Kalkulator · Skrip · Utilitas</div>
              </div>
              <div className={styles['nav-card-arrow']} aria-hidden="true">
                <Icon name="arrow-right" />
              </div>
            </a>
          </nav>
        </section>

        <aside className={styles['right-col']} aria-label="Log dan diagnostik">
          <LogPanel />
          <Diagnostics />
        </aside>
      </div>

      <footer className={styles['page-footer']}>
        <div className={styles['footer-left']}>v2.4.1 · AES-256-GCM</div>
        <div className={styles['footer-center']}>rony.biz.id</div>
        <div className={styles['footer-right']}>© 2025 Rony Brothers</div>
      </footer>
    </>
  );
};
