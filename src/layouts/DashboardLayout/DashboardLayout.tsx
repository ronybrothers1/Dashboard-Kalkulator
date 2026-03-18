import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Icon } from '../../components/Icon/Icon';
import { Clock } from '../../components/Clock/Clock';
import { Modal } from '../../components/Modal/Modal';
import styles from './DashboardLayout.module.css';

export const DashboardLayout: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cpu, setCpu] = useState(0);
  const [ram, setRam] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCpu(62);
      setRam(78);
    }, 850);
    return () => clearTimeout(timeout);
  }, []);

  const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);

  return (
    <>
      <div className="bg-canvas" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      {/* TOPBAR */}
      <header className={styles.topbar}>
        <div className={styles['topbar-brand']}>
          <div className={styles['brand-icon']} aria-hidden="true">RB</div>
          <div>
            <div className={styles['brand-name']}>Rony Brothers</div>
            <div className={styles['brand-tag']}>Portal Resmi</div>
          </div>
        </div>

        <nav className={styles['topbar-nav']} aria-label="Navigasi utama">
          <a href="https://www.rony.biz.id/profil" className={`${styles['nav-item']} ${styles.active}`} rel="noopener noreferrer">
            <Icon name="profile" /> Profil
          </a>
          <a href="https://www.rony.biz.id/tools" className={styles['nav-item']} rel="noopener noreferrer">
            <Icon name="tools" /> Tool
          </a>
        </nav>

        <div className={styles['topbar-right']}>
          <div className={styles['status-pill']} role="status" aria-label="Status sistem: Online">
            <div className={styles['status-dot']} aria-hidden="true" />
            <span>Online</span>
          </div>
          <Clock />
          <button className={styles['menu-btn']} onClick={toggleDrawer} aria-label="Buka menu" aria-expanded={isDrawerOpen}>
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* LAYOUT */}
      <div className={styles.layout}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar} aria-label="Navigasi samping">
          <div className={styles['sidebar-section-label']}>Navigasi</div>

          <a href="https://www.rony.biz.id/profil" className={`${styles['sidebar-link']} ${styles.active}`} rel="noopener noreferrer">
            <Icon name="profile" /> Profil
            <span className={styles['sidebar-badge']} aria-label="Node 01">01</span>
          </a>

          <a href="https://www.rony.biz.id/tools" className={styles['sidebar-link']} rel="noopener noreferrer">
            <Icon name="tools" /> Tool
            <span className={styles['sidebar-badge']} aria-label="Node 02">02</span>
          </a>

          <div className={styles['sidebar-section-label']}>Teknik Sipil</div>

          <button type="button" className={styles['sidebar-btn']} aria-label="Dashboard (tidak tersedia)" disabled style={{ opacity: 0.45, cursor: 'not-allowed' }}>
            <Icon name="dashboard" /> Dashboard
          </button>

          <button type="button" className={styles['sidebar-btn']} onClick={() => setIsModalOpen(true)} aria-label="Lihat info struktur — Imam Sahroni Darmawan" aria-haspopup="dialog">
            <Icon name="blueprint" /> Sistem Info
          </button>

          <div className={styles['sidebar-bottom']}>
            <div className={styles['sys-info']}>
              <div>
                <div className={styles['sys-row']}>
                  <span className={styles['sys-key']}>CPU</span>
                  <span className={styles['sys-val']}>{cpu}%</span>
                </div>
                <div className={styles['mini-bar']} role="progressbar" aria-valuenow={cpu} aria-valuemin={0} aria-valuemax={100} aria-label="CPU load">
                  <div className={`${styles['mini-fill']} ${styles.blue}`} style={{ width: `${cpu}%` }} />
                </div>
              </div>
              <div>
                <div className={styles['sys-row']}>
                  <span className={styles['sys-key']}>RAM</span>
                  <span className={styles['sys-val']}>{ram}%</span>
                </div>
                <div className={styles['mini-bar']} role="progressbar" aria-valuenow={ram} aria-valuemin={0} aria-valuemax={100} aria-label="Memory usage">
                  <div className={`${styles['mini-fill']} ${styles.amber}`} style={{ width: `${ram}%` }} />
                </div>
              </div>
              <div className={styles['sys-row']} style={{ marginTop: 4 }}>
                <span className={styles['sys-key']}>ENC</span>
                <span className={styles['sys-val']} style={{ color: 'var(--teal)' }}>AES-256</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>

      {/* MOBILE DRAWER */}
      <div className={`${styles['drawer-overlay']} ${isDrawerOpen ? styles.open : ''}`} onClick={toggleDrawer} role="dialog" aria-modal="true" aria-label="Navigasi">
        <nav className={styles.drawer} onClick={(e) => e.stopPropagation()}>
          <button className={styles['drawer-close']} onClick={toggleDrawer} aria-label="Tutup menu">×</button>
          <div className={styles['drawer-section']}>Menu</div>
          <a href="https://www.rony.biz.id/profil" className={styles['drawer-link']} rel="noopener noreferrer">
            Profil <Icon name="arrow-right" />
          </a>
          <a href="https://www.rony.biz.id/tools" className={styles['drawer-link']} rel="noopener noreferrer">
            Tool <Icon name="arrow-right" />
          </a>
        </nav>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Info Struktur: Imam Sahroni Darmawan"
        label="Sistem Info · Profil Struktur"
        profile={{
          initials: 'IS',
          name: 'Imam Sahroni Darmawan, S.T',
          role: 'Sarjana Teknik · Teknik Sipil',
          chips: [
            { label: 'Aktif', color: 'green' },
            { label: 'S.T — Teknik Sipil', color: 'blue' },
            { label: 'Terverifikasi', color: 'amber' }
          ]
        }}
        footer={<button type="button" className={styles['modal-btn-close']} onClick={() => setIsModalOpen(false)}>Tutup</button>}
      >
        <div className={styles['modal-field']}>
          <dt className={styles['modal-field-key']}>Nama Lengkap</dt>
          <dd className={`${styles['modal-field-val']} ${styles.accent}`}>Imam Sahroni Darmawan</dd>
        </div>
        <div className={styles['modal-field']}>
          <dt className={styles['modal-field-key']}>Gelar</dt>
          <dd className={`${styles['modal-field-val']} ${styles.amber}`}>S.T</dd>
        </div>
        <div className={styles['modal-field']}>
          <dt className={styles['modal-field-key']}>Bidang</dt>
          <dd className={`${styles['modal-field-val']} ${styles.mono}`}>Teknik Sipil</dd>
        </div>
        <div className={styles['modal-field']}>
          <dt className={styles['modal-field-key']}>Status</dt>
          <dd className={`${styles['modal-field-val']} ${styles.mono}`} style={{ color: 'var(--green)' }}>Aktif</dd>
        </div>
        <div className={styles['modal-field']}>
          <dt className={styles['modal-field-key']}>Enkripsi</dt>
          <dd className={`${styles['modal-field-val']} ${styles.mono}`}>AES-256-GCM</dd>
        </div>
        <div className={styles['modal-field']}>
          <dt className={styles['modal-field-key']}>Clearance</dt>
          <dd className={`${styles['modal-field-val']} ${styles.mono}`}>Level 5</dd>
        </div>
      </Modal>
    </>
  );
};
