import React from 'react';
import { Clock, CheckCircle2, PlayCircle, Circle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';
import { formatTimeDisplay } from './ActivityItem';

export default function TimelineView({ activities, onStatusChange, onEdit }) {
  // Sort activities by start time (nulls last)
  const sorted = [...activities].sort((a, b) => {
    if (!a.startTime && !b.startTime) return 0;
    if (!a.startTime) return 1;
    if (!b.startTime) return -1;
    return a.startTime.localeCompare(b.startTime);
  });

  if (sorted.length === 0) {
    return (
      <div className="empty-state">
        <Clock size={36} color="var(--text-muted)" style={{ marginBottom: 12 }} />
        <div className="empty-title">No scheduled activities for this day</div>
        <div className="empty-subtitle">Use the quick add bar above to plan your day.</div>
      </div>
    );
  }

  return (
    <div className="timeline-container">
      {sorted.map((act) => {
        const timeFormatted = act.startTime
          ? `${formatTimeDisplay(act.startTime)}${act.endTime ? ` – ${formatTimeDisplay(act.endTime)}` : ''}`
          : 'Any Time';

        const statusClass =
          act.status === 'COMPLETED'
            ? 'status-completed'
            : act.status === 'ONGOING'
            ? 'status-ongoing'
            : '';

        return (
          <div key={act.id} className="timeline-slot">
            <div className="timeline-time-label">
              <span>{timeFormatted}</span>
            </div>

            <div
              className={`timeline-content-card ${statusClass}`}
              onClick={() => onEdit(act)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-main)' }}>
                  {act.title}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PriorityBadge priority={act.priority} />
                  <CategoryBadge category={act.category} />
                  <StatusBadge
                    status={act.status}
                    onStatusChange={(newStatus) => onStatusChange(act.id, newStatus)}
                    size="small"
                  />
                </div>
              </div>

              {act.description && (
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  {act.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
