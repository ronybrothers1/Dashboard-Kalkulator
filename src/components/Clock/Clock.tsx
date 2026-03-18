import React, { useState, useEffect } from 'react';

export const Clock = React.memo(() => {
  const [time, setTime] = useState<string>('00:00:00');

  useEffect(() => {
    const tick = () => {
      const n = new Date();
      setTime(
        String(n.getHours()).padStart(2, '0') + ':' +
        String(n.getMinutes()).padStart(2, '0') + ':' +
        String(n.getSeconds()).padStart(2, '0')
      );
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <time className="font-mono text-[11px] text-[var(--text-muted)] tracking-[0.8px] whitespace-nowrap" aria-live="off" aria-label="Jam saat ini">
      {time}
    </time>
  );
});
