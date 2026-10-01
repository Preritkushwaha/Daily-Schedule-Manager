import React, { useState, useRef, useEffect } from 'react';
import { Circle, PlayCircle, CheckCircle2, ChevronDown } from 'lucide-react';

export const STATUS_CONFIG = {
  NOT_STARTED: {
    label: 'Not Started',
    badgeClass: 'status-not_started',
    icon: Circle,
    color: '#9b9a97',
  },
  ONGOING: {
    label: 'Ongoing',
    badgeClass: 'status-ongoing',
    icon: PlayCircle,
    color: '#0b6e99',
  },
  COMPLETED: {
    label: 'Completed',
    badgeClass: 'status-completed',
    icon: CheckCircle2,
    color: '#28633c',
  },
};

export default function StatusBadge({ status, onStatusChange, allowChange = true, size = 'normal' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentConfig = STATUS_CONFIG[status] || STATUS_CONFIG.NOT_STARTED;
  const Icon = currentConfig.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (newStatus, e) => {
    e.stopPropagation();
    if (newStatus !== status && onStatusChange) {
      onStatusChange(newStatus);
    }
    setIsOpen(false);
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    if (allowChange) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} ref={dropdownRef}>
      <button
        type="button"
        className={`status-badge ${currentConfig.badgeClass}`}
        onClick={toggleDropdown}
        style={{
          cursor: allowChange ? 'pointer' : 'default',
          padding: size === 'small' ? '2px 6px' : '3px 9px',
          fontSize: size === 'small' ? '11px' : '12px',
        }}
        title={allowChange ? "Click to change status" : undefined}
      >
        <Icon size={size === 'small' ? 12 : 13} style={{ flexShrink: 0 }} />
        <span>{currentConfig.label}</span>
        {allowChange && <ChevronDown size={11} style={{ opacity: 0.6 }} />}
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            background: 'white',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            boxShadow: 'var(--shadow-md)',
            padding: '4px',
            zIndex: 100,
            minWidth: '130px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {Object.entries(STATUS_CONFIG).map(([key, config]) => {
            const ItemIcon = config.icon;
            const isSelected = key === status;
            return (
              <button
                key={key}
                type="button"
                onClick={(e) => handleSelect(key, e)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 600 : 400,
                  color: 'var(--text-main)',
                  backgroundColor: isSelected ? 'var(--bg-hover)' : 'transparent',
                  textAlign: 'left',
                  width: '100%',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-hover)')}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = isSelected ? 'var(--bg-hover)' : 'transparent')
                }
              >
                <ItemIcon size={13} color={config.color} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
