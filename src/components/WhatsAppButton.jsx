import React, { useState } from 'react';
import './WhatsAppButton.css';

/**
 * Floating WhatsApp Chat Button
 * ─────────────────────────────
 * Change the phone number below to the foundation's actual WhatsApp number.
 * Format: country code + number, no spaces or symbols (e.g., 919876543210)
 */
const DEFAULT_MESSAGE = 'Hi! I visited the We Are Youth Foundation website and would like to know more about your work. 🙏';

const WhatsAppButton = ({ siteSettings }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  const phone = siteSettings?.numbers || '+91 80903 34855';
  const cleanPhone = phone.replace(/\D/g, '');

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

  return (
    <div className="whatsapp-float-container">
      {/* Chat Bubble Message */}
      {showBubble && (
        <div className="whatsapp-bubble">
          <button 
            className="bubble-close" 
            onClick={(e) => { e.stopPropagation(); setShowBubble(false); }}
            aria-label="Close"
          >
            ✕
          </button>
          <p>👋 Need help? Chat with us on WhatsApp!</p>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float-btn"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
      >
        {/* WhatsApp SVG Icon */}
        <svg viewBox="0 0 32 32" className="whatsapp-icon">
          <path
            d="M16.004 0C7.165 0 0 7.163 0 16.001c0 2.822.737 5.574 2.137 7.998L.073 32l8.204-2.033A15.94 15.94 0 0 0 16.004 32C24.838 32 32 24.837 32 16.001 32 7.163 24.838 0 16.004 0zm0 29.32a13.28 13.28 0 0 1-6.778-1.856l-.486-.288-5.037 1.248 1.302-4.903-.316-.503A13.21 13.21 0 0 1 2.68 16C2.68 8.646 8.648 2.68 16.004 2.68c3.564 0 6.913 1.389 9.431 3.908a13.24 13.24 0 0 1 3.886 9.413c0 7.357-5.968 13.32-13.317 13.32zm7.304-9.976c-.4-.2-2.366-1.168-2.733-1.301-.367-.134-.634-.2-.9.2-.268.4-1.035 1.3-1.268 1.568-.234.267-.468.3-.868.1-.4-.2-1.688-.622-3.215-1.984-1.189-1.06-1.991-2.37-2.224-2.77-.234-.4-.025-.616.175-.816.18-.18.4-.467.6-.7.2-.234.267-.4.4-.668.134-.267.067-.5-.033-.7-.1-.2-.9-2.168-1.234-2.968-.325-.78-.655-.674-.9-.686l-.768-.013c-.267 0-.7.1-1.067.5s-1.4 1.368-1.4 3.335c0 1.968 1.434 3.87 1.634 4.137.2.267 2.822 4.31 6.838 6.043.955.413 1.7.659 2.282.844.959.305 1.832.262 2.522.159.77-.115 2.366-.968 2.7-1.902.333-.934.333-1.735.233-1.902-.1-.168-.367-.267-.767-.467z"
            fill="currentColor"
          />
        </svg>

        {/* Pulse Ring */}
        <span className="whatsapp-pulse"></span>
      </a>

      {/* Tooltip */}
      {isTooltipVisible && (
        <div className="whatsapp-tooltip">Chat with us</div>
      )}
    </div>
  );
};

export default WhatsAppButton;
