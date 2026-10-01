import React from 'react';
import { Check, Clock, Edit3, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';

export function formatTimeDisplay(timeStr) {
  if (!timeStr) return '';
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12
  return `${hours}:${minutes} ${ampm}`;
}

export default function ActivityItem({ activity, onStatusChange, onEdit, onDelete }) {
  const isCompleted = activity.status === 'COMPLETED';
  const isOngoing = activity.status === 'ONGOING';

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    if (isCompleted) {
      onStatusChange(activity.id, 'NOT_STARTED');
    } else {
      onStatusChange(activity.id, 'COMPLETED');
    }
  };

  const timeLabel = () => {
    if (!activity.startTime && !activity.endTime) return null;
    const start = formatTimeDisplay(activity.startTime);
    const end = formatTimeDisplay(activity.endTime);
    if (start && end) return `${start} – ${end}`;
    if (start) return `At ${start}`;
    return `Until ${end}`;
  };

  const formattedTime = timeLabel();

  return (
    <div className={`activity-row ${isCompleted ? 'is-completed' : ''}`}>
      <div className="activity-row-left">
        <button
          type="button"
          className={`activity-checkbox ${isCompleted ? 'checked' : isOngoing ? 'ongoing' : ''}`}
          onClick={handleCheckboxClick}
          title={isCompleted ? 'Mark as Not Started' : 'Mark as Completed'}
        >
          {isCompleted && <Check size={11} strokeWidth={3} />}
          {isOngoing && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#0b6e99' }} />}
        </button>

        <div className="activity-text-group" onClick={() => onEdit(activity)}>
          <span className="activity-title">{activity.title}</span>
          {activity.description && (
            <span className="activity-desc-preview">{activity.description}</span>
          )}
        </div>
      </div>

      <div className="activity-row-right">
        {formattedTime && (
          <span className="time-badge">
            <Clock size={11} />
            {formattedTime}
          </span>
        )}

        <CategoryBadge category={activity.category} />
        <PriorityBadge priority={activity.priority} />

        <StatusBadge
          status={activity.status}
          onStatusChange={(newStatus) => onStatusChange(activity.id, newStatus)}
        />

        <div className="row-actions">
          <button
            type="button"
            className="btn-action-icon"
            onClick={() => onEdit(activity)}
            title="Edit Activity"
          >
            <Edit3 size={13} />
          </button>
          <button
            type="button"
            className="btn-action-icon danger"
            onClick={() => onDelete(activity.id)}
            title="Delete Activity"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
