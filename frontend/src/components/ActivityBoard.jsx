import React from 'react';
import { Circle, PlayCircle, CheckCircle2, Clock, Trash2, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';
import { formatTimeDisplay } from './ActivityItem';

const COLUMNS = [
  { key: 'NOT_STARTED', label: 'Not Started', icon: Circle, color: '#9b9a97' },
  { key: 'ONGOING', label: 'Ongoing', icon: PlayCircle, color: '#0b6e99' },
  { key: 'COMPLETED', label: 'Completed', icon: CheckCircle2, color: '#28633c' },
];

export default function ActivityBoard({ activities, onStatusChange, onEdit, onDelete }) {
  const getActivitiesForStatus = (statusKey) => {
    return activities.filter((act) => act.status === statusKey);
  };

  return (
    <div className="board-container">
      {COLUMNS.map((col) => {
        const colActivities = getActivitiesForStatus(col.key);
        const ColIcon = col.icon;

        return (
          <div key={col.key} className="board-column">
            <div className="column-header">
              <div className="column-title-wrap">
                <ColIcon size={14} color={col.color} />
                <span style={{ fontSize: '13px', fontWeight: 600 }}>{col.label}</span>
                <span className="column-count">{colActivities.length}</span>
              </div>
            </div>

            <div className="column-cards">
              {colActivities.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No activities in {col.label.toLowerCase()}
                </div>
              ) : (
                colActivities.map((act) => {
                  const timeFormatted =
                    act.startTime || act.endTime
                      ? `${act.startTime ? formatTimeDisplay(act.startTime) : ''}${
                          act.endTime ? ` – ${formatTimeDisplay(act.endTime)}` : ''
                        }`
                      : null;

                  return (
                    <div key={act.id} className="board-card" onClick={() => onEdit(act)}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
                        <span className="card-title">{act.title}</span>
                        <PriorityBadge priority={act.priority} showLabel={false} />
                      </div>

                      {act.description && <p className="card-desc">{act.description}</p>}

                      <div className="card-footer">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                          <CategoryBadge category={act.category} />
                          {timeFormatted && (
                            <span className="time-badge" style={{ fontSize: '11px', padding: '1px 5px' }}>
                              <Clock size={10} />
                              {timeFormatted}
                            </span>
                          )}
                        </div>

                        {/* Quick Status Shift buttons */}
                        <div className="card-actions-mini" onClick={(e) => e.stopPropagation()}>
                          {col.key === 'NOT_STARTED' && (
                            <button
                              type="button"
                              className="btn-action-icon"
                              title="Start (Move to Ongoing)"
                              onClick={() => onStatusChange(act.id, 'ONGOING')}
                            >
                              <PlayCircle size={13} color="#0b6e99" />
                            </button>
                          )}

                          {col.key === 'ONGOING' && (
                            <>
                              <button
                                type="button"
                                className="btn-action-icon"
                                title="Move back to Not Started"
                                onClick={() => onStatusChange(act.id, 'NOT_STARTED')}
                              >
                                <ArrowLeft size={13} />
                              </button>
                              <button
                                type="button"
                                className="btn-action-icon"
                                title="Mark Completed"
                                onClick={() => onStatusChange(act.id, 'COMPLETED')}
                              >
                                <CheckCircle2 size={13} color="#28633c" />
                              </button>
                            </>
                          )}

                          {col.key === 'COMPLETED' && (
                            <button
                              type="button"
                              className="btn-action-icon"
                              title="Reopen (Move to Ongoing)"
                              onClick={() => onStatusChange(act.id, 'ONGOING')}
                            >
                              <ArrowLeft size={13} />
                            </button>
                          )}

                          <button
                            type="button"
                            className="btn-action-icon"
                            title="Edit"
                            onClick={() => onEdit(act)}
                          >
                            <Edit3 size={12} />
                          </button>
                          <button
                            type="button"
                            className="btn-action-icon danger"
                            title="Delete"
                            onClick={() => onDelete(act.id)}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
