import React from 'react';
import { Target, CheckCircle2, PlayCircle, Circle } from 'lucide-react';

export default function ProgressBar({ summary }) {
  if (!summary) return null;

  const { totalActivities = 0, completedActivities = 0, ongoingActivities = 0, notStartedActivities = 0, completionPercentage = 0 } = summary;

  return (
    <div className="progress-card">
      <div className="progress-header">
        <div className="progress-title-wrap">
          <Target size={16} color="var(--text-secondary)" />
          <span>Daily Progress</span>
        </div>
        <div className="progress-stats">
          <span>{completedActivities} of {totalActivities} completed ({completionPercentage}%)</span>
        </div>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${completionPercentage}%` }}
        />
      </div>

      <div className="progress-badges-row">
        <div className="progress-pill-stat">
          <span className="stat-dot dot-completed" />
          <span>Completed: <strong>{completedActivities}</strong></span>
        </div>
        <div className="progress-pill-stat">
          <span className="stat-dot dot-ongoing" />
          <span>Ongoing: <strong>{ongoingActivities}</strong></span>
        </div>
        <div className="progress-pill-stat">
          <span className="stat-dot dot-not-started" />
          <span>Not Started: <strong>{notStartedActivities}</strong></span>
        </div>
      </div>
    </div>
  );
}
