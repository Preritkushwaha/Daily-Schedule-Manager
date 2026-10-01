import React from 'react';
import { Calendar, Sun, Clock, CheckCircle2, PlayCircle, Circle, FolderKanban, Tag } from 'lucide-react';

export default function Sidebar({
  selectedDate,
  onDateChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  summary,
}) {
  const getTodayIso = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getTomorrowIso = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const todayIso = getTodayIso();
  const tomorrowIso = getTomorrowIso();

  const isToday = selectedDate === todayIso;
  const isTomorrow = selectedDate === tomorrowIso;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="workspace-icon">📅</div>
        <div>
          <div className="workspace-name">Daily Schedule</div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Personal Workspace</div>
        </div>
      </div>

      <div className="sidebar-section-title">Schedule Views</div>
      <nav className="sidebar-nav">
        <div
          className={`nav-item ${isToday ? 'active' : ''}`}
          onClick={() => onDateChange(todayIso)}
        >
          <div className="nav-item-left">
            <Sun size={14} color="#f2994a" />
            <span>Today</span>
          </div>
          {isToday && summary && (
            <span className="nav-count">{summary.totalActivities}</span>
          )}
        </div>

        <div
          className={`nav-item ${isTomorrow ? 'active' : ''}`}
          onClick={() => onDateChange(tomorrowIso)}
        >
          <div className="nav-item-left">
            <Calendar size={14} color="#2f80ed" />
            <span>Tomorrow</span>
          </div>
        </div>
      </nav>

      <div className="sidebar-section-title">Status Filter</div>
      <nav className="sidebar-nav">
        <div
          className={`nav-item ${statusFilter === 'ALL' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('ALL')}
        >
          <div className="nav-item-left">
            <FolderKanban size={14} />
            <span>All Tasks</span>
          </div>
          {summary && <span className="nav-count">{summary.totalActivities}</span>}
        </div>

        <div
          className={`nav-item ${statusFilter === 'NOT_STARTED' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('NOT_STARTED')}
        >
          <div className="nav-item-left">
            <Circle size={14} color="#9b9a97" />
            <span>Not Started</span>
          </div>
          {summary && <span className="nav-count">{summary.notStartedActivities}</span>}
        </div>

        <div
          className={`nav-item ${statusFilter === 'ONGOING' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('ONGOING')}
        >
          <div className="nav-item-left">
            <PlayCircle size={14} color="#0b6e99" />
            <span>Ongoing</span>
          </div>
          {summary && <span className="nav-count">{summary.ongoingActivities}</span>}
        </div>

        <div
          className={`nav-item ${statusFilter === 'COMPLETED' ? 'active' : ''}`}
          onClick={() => onStatusFilterChange('COMPLETED')}
        >
          <div className="nav-item-left">
            <CheckCircle2 size={14} color="#28633c" />
            <span>Completed</span>
          </div>
          {summary && <span className="nav-count">{summary.completedActivities}</span>}
        </div>
      </nav>

      <div className="sidebar-section-title">Categories</div>
      <nav className="sidebar-nav">
        {['ALL', 'Work', 'Health', 'Study', 'Personal', 'General'].map((cat) => (
          <div
            key={cat}
            className={`nav-item ${categoryFilter === cat ? 'active' : ''}`}
            onClick={() => onCategoryFilterChange(cat)}
          >
            <div className="nav-item-left">
              <Tag size={13} style={{ opacity: 0.7 }} />
              <span>{cat === 'ALL' ? 'All Categories' : cat}</span>
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
