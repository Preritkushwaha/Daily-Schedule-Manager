import React, { useState, useEffect } from 'react';
import { X, Trash2, Calendar, Clock, Tag, Flag, CheckCircle2 } from 'lucide-react';

export default function ActivityModal({ activity, isOpen, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [status, setStatus] = useState('NOT_STARTED');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('General');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activity) {
      setTitle(activity.title || '');
      setDescription(activity.description || '');
      setScheduleDate(activity.scheduleDate || '');
      setStartTime(activity.startTime ? activity.startTime.substring(0, 5) : '');
      setEndTime(activity.endTime ? activity.endTime.substring(0, 5) : '');
      setStatus(activity.status || 'NOT_STARTED');
      setPriority(activity.priority || 'MEDIUM');
      setCategory(activity.category || 'General');
    }
  }, [activity]);

  if (!isOpen || !activity) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim() || isSaving) return;

    setIsSaving(true);
    try {
      await onSave(activity.id, {
        title: title.trim(),
        description: description.trim(),
        scheduleDate,
        startTime: startTime ? `${startTime}:00` : null,
        endTime: endTime ? `${endTime}:00` : null,
        status,
        priority,
        category,
      });
      onClose();
    } catch (err) {
      console.error('Error saving activity:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>
              Activity Details
            </span>
          </div>

          <div className="modal-header-actions">
            <button
              type="button"
              className="btn-action-icon danger"
              onClick={() => {
                if (window.confirm('Delete this activity?')) {
                  onDelete(activity.id);
                  onClose();
                }
              }}
              title="Delete Activity"
            >
              <Trash2 size={15} />
            </button>
            <button
              type="button"
              className="btn-action-icon"
              onClick={onClose}
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="modal-body">
            {/* Title */}
            <input
              type="text"
              className="modal-title-input"
              placeholder="Activity Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {/* Notion Properties Grid */}
            <div className="properties-table">
              {/* Status */}
              <div className="property-row">
                <div className="property-label">
                  <CheckCircle2 size={14} />
                  <span>Status</span>
                </div>
                <div className="property-value">
                  <select
                    className="modal-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="ONGOING">Ongoing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>
              </div>

              {/* Date */}
              <div className="property-row">
                <div className="property-label">
                  <Calendar size={14} />
                  <span>Date</span>
                </div>
                <div className="property-value">
                  <input
                    type="date"
                    className="modal-input"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Time */}
              <div className="property-row">
                <div className="property-label">
                  <Clock size={14} />
                  <span>Time</span>
                </div>
                <div className="property-value" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="time"
                    className="modal-input"
                    style={{ width: '110px' }}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>to</span>
                  <input
                    type="time"
                    className="modal-input"
                    style={{ width: '110px' }}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Priority */}
              <div className="property-row">
                <div className="property-label">
                  <Flag size={14} />
                  <span>Priority</span>
                </div>
                <div className="property-value">
                  <select
                    className="modal-select"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                  >
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="LOW">Low Priority</option>
                  </select>
                </div>
              </div>

              {/* Category */}
              <div className="property-row">
                <div className="property-label">
                  <Tag size={14} />
                  <span>Category</span>
                </div>
                <div className="property-value">
                  <select
                    className="modal-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Health">Health</option>
                    <option value="Study">Study</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description / Notes area */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Notes & Description
              </span>
              <textarea
                className="modal-desc-area"
                placeholder="Write notes, steps, or details about this activity..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!title.trim() || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
