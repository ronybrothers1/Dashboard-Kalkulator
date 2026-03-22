import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Icon } from '../Icon/Icon';
import styles from './AIAssistant.module.css';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

let aiClient: GoogleGenAI | null = null;

const getAIClient = () => {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
      return null;
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
};

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: 'Sistem AI aktif. Ada yang bisa saya bantu?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatRef.current) {
      const client = getAIClient();
      if (client) {
        chatRef.current = client.chats.create({
          model: 'gemini-3.1-flash-lite-preview',
          config: {
            systemInstruction: 'Anda adalah AI Assistant di portal Rony Brothers. Jawab dengan singkat, profesional, dan bernada teknis/cyber.',
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setIsLoading(true);

    // Placeholder for model response
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      if (!chatRef.current) {
        throw new Error("AI Client not initialized. Please check API Key.");
      }
      const responseStream = await chatRef.current.sendMessageStream({ message: userText });
      for await (const chunk of responseStream) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text += chunk.text || '';
          return newMessages;
        });
      }
    } catch (error: any) {
      console.error("AI Error:", error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].text = '[ERROR] Koneksi ke AI Core terputus.';
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
        className={`${styles['fab']} ${isOpen ? styles['fab-hidden'] : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Buka AI Assistant"
      >
        <Icon name="bolt" className={styles['fab-icon']} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            key="chat-panel"
            className={styles['chat-panel']}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className={styles['chat-header']}>
              <div className={styles['chat-title']}>
                <Icon name="bolt" />
                AI Core // Fast Response
              </div>
              <button className={styles['chat-close']} onClick={() => setIsOpen(false)} aria-label="Tutup AI Assistant">
                ×
              </button>
            </div>

            <div className={styles['chat-body']}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`${styles['message-wrapper']} ${styles[msg.role]}`}>
                  <div className={styles['message-bubble']}>
                    {msg.role === 'model' ? (
                      <div className="markdown-body">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className={`${styles['message-wrapper']} ${styles.model}`}>
                  <div className={styles['message-bubble']}>
                    <span className={styles['typing-dot']}>.</span>
                    <span className={styles['typing-dot']}>.</span>
                    <span className={styles['typing-dot']}>.</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className={styles['chat-footer']} onSubmit={handleSend}>
              <input 
                type="text" 
                className={styles['chat-input']} 
                placeholder="Masukkan perintah..." 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button 
                type="submit" 
                className={styles['chat-send']} 
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
