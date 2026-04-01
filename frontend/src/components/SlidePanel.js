import { useEffect } from 'react';
import './SlidePanel.css';

function SlidePanel({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="slide-panel-overlay" onClick={onClose} />
      <div className="slide-panel">
        <div className="slide-panel-header">
          <h2 className="slide-panel-title">{title}</h2>
          <button className="slide-panel-close" onClick={onClose}>×</button>
        </div>
        <div className="slide-panel-content">
          {children}
        </div>
      </div>
    </>
  );
}

export default SlidePanel;
