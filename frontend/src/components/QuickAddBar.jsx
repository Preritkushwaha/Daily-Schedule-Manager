import React, { useState } from 'react';
import { Plus, Clock, Tag, Flag, Check } from 'lucide-react';

export default function QuickAddBar({ selectedDate, onAddActivity }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [category, setCategory] = useState('Work');
  const [status, setStatus] = useState('NOT_STARTED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddActivity({
        title: title.trim(),
        description: description.trim(),
        scheduleDate: selectedDate,
        startTime: startTime ? `${startTime}:00` : null,
        endTime: endTime ? `${endTime}:00` : null,
        priority,
        category,
        status,
      });

      // Reset form
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setPriority('MEDIUM');
      setCategory('Work');
      setStatus('NOT_STARTED');
      setIsExpanded(false);
    } catch (err) {
      console.error('Error adding activity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
    }
  };

  if (!isExpanded) {
    return (
      <div className="quick-add-container">
        <button
          type="button"
          className="quick-add-trigger"
          onClick={() => setIsExpanded(true)}
        >
          <Plus size={16} />
          <span>Add activity to schedule...</span>
        </button>
      </div>
    );
  }

  return (
    <div className="quick-add-container">
      <form className="quick-add-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="quick-add-input"
          placeholder="Activity name, e.g. Team Standup, Gym workout..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
        />

        <textarea
          className="quick-add-desc-input"
          placeholder="Add description or notes (optional)..."
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="quick-add-controls">
          <div className="quick-add-chips">
            {/* Time controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} color="var(--text-secondary)" />
              <input
                type="time"
                className="chip-time-input"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                title="Start time"
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>to</span>
              <input
                type="time"
                className="chip-time-input"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                title="End time"
              />
            </div>

            {/* Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Tag size={13} color="var(--text-secondary)" />
              <select
                className="chip-select"
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

            {/* Priority */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Flag size={13} color="var(--text-secondary)" />
              <select
                className="chip-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="HIGH">High Priority</option>
                <option value="MEDIUM">Medium Priority</option>
                <option value="LOW">Low Priority</option>
              </select>
            </div>

            {/* Initial Status */}
            <select
              className="chip-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="NOT_STARTED">Not Started</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="quick-add-btns">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setIsExpanded(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={!title.trim() || isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Activity'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
