import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Icon } from '../Icon/Icon';
import styles from './AIAssistant.module.css';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

// ── Singleton AI client ──────────────────────────────────────────────────────
let aiClient: GoogleGenAI | null = null;

const getAIClient = (): GoogleGenAI | null => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not set — AI features disabled.');
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

// ── Types ────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'model';
  text: string;
}

interface DragPos {
  x: number;
  y: number;
}

// ── Constants ────────────────────────────────────────────────────────────────
const FAB_SIZE = 56;
const FAB_MARGIN = 24;

/**
 * Clamp FAB position so it never goes off-screen.
 */
function clampPos(x: number, y: number): DragPos {
  const maxX = window.innerWidth - FAB_SIZE - FAB_MARGIN;
  const maxY = window.innerHeight - FAB_SIZE - FAB_MARGIN;
  return {
    x: Math.max(FAB_MARGIN, Math.min(x, maxX)),
    y: Math.max(FAB_MARGIN, Math.min(y, maxY)),
  };
}

/**
 * Initial position: vertically centered, horizontally at right edge.
 */
function getInitialPos(): DragPos {
  return {
    x: window.innerWidth - FAB_SIZE - FAB_MARGIN,
    y: Math.round(window.innerHeight / 2) - Math.round(FAB_SIZE / 2),
  };
}

// ── Component ────────────────────────────────────────────────────────────────
export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Sistem AI aktif. Ada yang bisa saya bantu?' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Draggable FAB state
  const [fabPos, setFabPos] = useState<DragPos>(getInitialPos);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; fabX: number; fabY: number } | null>(null);
  const didDragRef = useRef(false); // distinguish click vs drag

  const chatRef = useRef<ReturnType<GoogleGenAI['chats']['create']> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Init AI chat session ───────────────────────────────────────────────────
  useEffect(() => {
    if (!chatRef.current) {
      const client = getAIClient();
      if (client) {
        chatRef.current = client.chats.create({
          model: 'gemini-3.1-flash-lite-preview',
          config: {
            systemInstruction:
              'Anda adalah AI Assistant di portal Rony Brothers. Jawab dengan singkat, profesional, dan bernada teknis/cyber.',
          },
        });
      }
    }
  }, []);

  // ── Scroll to bottom on new message ───────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // ── Focus input when panel opens ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // ── Reposition FAB on window resize ───────────────────────────────────────
  useEffect(() => {
    const onResize = () => {
      setFabPos(prev => clampPos(prev.x, prev.y));
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleFabPointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    // Only left button (or touch)
    if (e.button !== 0 && e.button !== undefined) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      fabX: fabPos.x,
      fabY: fabPos.y,
    };
    didDragRef.current = false;
    setIsDragging(false);
  }, [fabPos]);

  const handleFabPointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.mouseX;
    const dy = e.clientY - dragStartRef.current.mouseY;
    // Threshold to distinguish tap from drag
    if (!didDragRef.current && Math.hypot(dx, dy) < 4) return;
    didDragRef.current = true;
    setIsDragging(true);
    setFabPos(clampPos(
      dragStartRef.current.fabX + dx,
      dragStartRef.current.fabY + dy,
    ));
  }, []);

  const handleFabPointerUp = useCallback(() => {
    dragStartRef.current = null;
    setIsDragging(false);
    // Click only if not dragged
    // (actual open handled by onClick)
  }, []);

  const handleFabClick = useCallback(() => {
    if (didDragRef.current) return; // was a drag, not a click
    setIsOpen(true);
  }, []);

  // ── Chat panel position (anchored near FAB, clamped to screen) ─────────────
  const chatPanelStyle = React.useMemo(() => {
    const PANEL_W = Math.min(380, window.innerWidth - 48);
    const PANEL_H = Math.min(500, window.innerHeight - 48);
    const GAP = 12;

    let left = fabPos.x - PANEL_W + FAB_SIZE;
    let top = fabPos.y - PANEL_H - GAP;

    // If would go above viewport, open below
    if (top < 24) top = fabPos.y + FAB_SIZE + GAP;
    // Clamp horizontal
    left = Math.max(24, Math.min(left, window.innerWidth - PANEL_W - 24));

    return { left, top, width: PANEL_W, maxHeight: PANEL_H };
  }, [fabPos, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Send message ──────────────────────────────────────────────────────────
  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);
    // Placeholder streaming bubble
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      if (!chatRef.current) {
        throw new Error('AI Client not initialized. Check API Key.');
      }
      const responseStream = await chatRef.current.sendMessageStream({ message: userText });
      for await (const chunk of responseStream) {
        setMessages(prev => {
          const next = [...prev];
          next[next.length - 1] = {
            ...next[next.length - 1],
            text: next[next.length - 1].text + (chunk.text ?? ''),
          };
          return next;
        });
      }
    } catch (err) {
      console.error('AI Error:', err);
      setMessages(prev => {
        const next = [...prev];
        next[next.length - 1] = { ...next[next.length - 1], text: '[ERROR] Koneksi ke AI Core terputus.' };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ── Keyboard shortcut: Escape closes panel ────────────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Draggable FAB ── */}
      <button
        className={`${styles.fab} ${isOpen ? styles.fabHidden : ''} ${isDragging ? styles.fabDragging : ''}`}
        style={{
          position: 'fixed',
          left: fabPos.x,
          top: fabPos.y,
          bottom: 'auto',
          right: 'auto',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
        }}
        onPointerDown={handleFabPointerDown}
        onPointerMove={handleFabPointerMove}
        onPointerUp={handleFabPointerUp}
        onPointerCancel={handleFabPointerUp}
        onClick={handleFabClick}
        aria-label="Buka AI Assistant"
        aria-haspopup="dialog"
        title="AI Assistant (drag untuk pindahkan)"
      >
        {/* Drag handle hint */}
        <span className={styles.fabDragHint} aria-hidden="true" />
        <Icon name="bolt" className={styles.fabIcon} />
      </button>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            className={styles.chatPanel}
            style={{
              position: 'fixed',
              left: chatPanelStyle.left,
              top: chatPanelStyle.top,
              width: chatPanelStyle.width,
              maxHeight: chatPanelStyle.maxHeight,
              bottom: 'auto',
              right: 'auto',
            }}
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            role="dialog"
            aria-modal="true"
            aria-label="AI Assistant"
          >
            <div className={styles.chatHeader}>
              <div className={styles.chatTitle}>
                <Icon name="bolt" />
                AI Core // Fast Response
              </div>
              <button
                className={styles.chatClose}
                onClick={() => setIsOpen(false)}
                aria-label="Tutup AI Assistant"
              >
                ×
              </button>
            </div>

            <div className={styles.chatBody}>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`${styles.messageWrapper} ${msg.role === 'user' ? styles.user : styles.model}`}
                >
                  <div className={styles.messageBubble}>
                    {msg.role === 'model' ? (
                      <div className={styles.markdownBody}>
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.text === '' && (
                <div className={`${styles.messageWrapper} ${styles.model}`}>
                  <div className={styles.messageBubble}>
                    <span className={styles.typingDot}>.</span>
                    <span className={styles.typingDot}>.</span>
                    <span className={styles.typingDot}>.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className={styles.chatFooter} onSubmit={handleSend}>
              <input
                ref={inputRef}
                type="text"
                className={styles.chatInput}
                placeholder="Masukkan perintah..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
                autoComplete="off"
              />
              <button
                type="submit"
                className={styles.chatSend}
                disabled={!input.trim() || isLoading}
                aria-label="Kirim pesan"
              >
                <Icon name="send" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
