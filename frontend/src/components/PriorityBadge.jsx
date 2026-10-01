import React from 'react';
import { Flag } from 'lucide-react';

export const PRIORITY_CONFIG = {
  HIGH: { label: 'High', className: 'priority-high', flagColor: '#eb5757' },
  MEDIUM: { label: 'Medium', className: 'priority-medium', flagColor: '#f2994a' },
  LOW: { label: 'Low', className: 'priority-low', flagColor: '#27ae60' },
};

export default function PriorityBadge({ priority, showLabel = true }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.MEDIUM;
  return (
    <span className={`priority-indicator ${config.className}`} title={`Priority: ${config.label}`}>
      <Flag size={12} fill={config.flagColor} strokeWidth={0} />
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
