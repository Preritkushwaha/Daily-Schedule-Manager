import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export default function DateNavigator({ selectedDate, onDateChange }) {
  const dateInputRef = useRef(null);

  // Format date helper
  const getFormattedLabel = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const target = new Date(year, month - 1, day);
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = target.toDateString() === today.toDateString();
    const isTomorrow = target.toDateString() === tomorrow.toDateString();
    const isYesterday = target.toDateString() === yesterday.toDateString();

    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    const dateFormatted = target.toLocaleDateString('en-US', options);

    if (isToday) return `Today • ${dateFormatted}`;
    if (isTomorrow) return `Tomorrow • ${dateFormatted}`;
    if (isYesterday) return `Yesterday • ${dateFormatted}`;
    return dateFormatted;
  };

  const handlePrevDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const prev = new Date(y, m - 1, d - 1);
    onDateChange(formatDateToIso(prev));
  };

  const handleNextDay = () => {
    const [y, m, d] = selectedDate.split('-').map(Number);
    const next = new Date(y, m - 1, d + 1);
    onDateChange(formatDateToIso(next));
  };

  const handleToday = () => {
    onDateChange(formatDateToIso(new Date()));
  };

  const formatDateToIso = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isTodayActive = () => {
    const now = new Date();
    return selectedDate === formatDateToIso(now);
  };

  return (
    <div className="date-navigator">
      <div className="date-controls">
        <button
          type="button"
          className="btn-icon-subtle"
          onClick={handlePrevDay}
          title="Previous Day"
        >
          <ChevronLeft size={16} />
        </button>

        <button
          type="button"
          className="date-display-btn"
          onClick={() => dateInputRef.current && dateInputRef.current.showPicker?.()}
          title="Pick a date"
        >
          <CalendarIcon size={14} color="var(--text-secondary)" />
          <span>{getFormattedLabel(selectedDate)}</span>
        </button>

        <input
          ref={dateInputRef}
          type="date"
          className="date-picker-input"
          value={selectedDate}
          onChange={(e) => e.target.value && onDateChange(e.target.value)}
        />

        <button
          type="button"
          className="btn-icon-subtle"
          onClick={handleNextDay}
          title="Next Day"
        >
          <ChevronRight size={16} />
        </button>

        {!isTodayActive() && (
          <button
            type="button"
            className="btn-today"
            onClick={handleToday}
          >
            Jump to Today
          </button>
        )}
      </div>
    </div>
  );
}
