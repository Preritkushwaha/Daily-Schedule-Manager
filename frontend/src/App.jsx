import React, { useState, useEffect, useCallback } from 'react';
import {
  List,
  Kanban,
  Clock,
  Search,
  Plus,
  RefreshCw,
  Calendar as CalendarIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import ProgressBar from './components/ProgressBar';
import DateNavigator from './components/DateNavigator';
import QuickAddBar from './components/QuickAddBar';
import ActivityItem from './components/ActivityItem';
import ActivityBoard from './components/ActivityBoard';
import TimelineView from './components/TimelineView';
import ActivityModal from './components/ActivityModal';
import AuthScreen from './components/AuthScreen';
import { AuthProvider, useAuth } from './context/AuthContext';
import {
  getActivities,
  getDailySummary,
  createActivity,
  updateActivity,
  updateActivityStatus,
  deleteActivity
} from './services/api';

function getTodayIso() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function ScheduleWorkspace() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  const [selectedDate, setSelectedDate] = useState(getTodayIso);
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & views
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'board' | 'timeline'
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Toast
  const [editingActivity, setEditingActivity] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      const [activitiesData, summaryData] = await Promise.all([
        getActivities(
          selectedDate,
          statusFilter !== 'ALL' ? statusFilter : null,
          categoryFilter !== 'ALL' ? categoryFilter : null
        ),
        getDailySummary(selectedDate)
      ]);

      setActivities(activitiesData);
      setSummary(summaryData);
    } catch (err) {
      console.error('Error fetching activities:', err);
      if (err.message !== 'Unauthorized') {
        setError('Failed to connect to backend server or retrieve schedule.');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, selectedDate, statusFilter, categoryFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Handlers
  const handleAddActivity = async (activityData) => {
    try {
      const created = await createActivity(activityData);
      showToast(`Added "${created.title}"`);
      await loadData();
    } catch (err) {
      alert('Failed to add activity: ' + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      // Optimistic update for fluid UI response
      setActivities((prev) =>
        prev.map((act) => (act.id === id ? { ...act, status: newStatus } : act))
      );

      await updateActivityStatus(id, newStatus);
      showToast(`Status updated`);
      // Refresh summary
      const newSummary = await getDailySummary(selectedDate);
      setSummary(newSummary);
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Error updating status');
      loadData();
    }
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (id, updatedData) => {
    try {
      await updateActivity(id, updatedData);
      showToast('Activity updated');
      loadData();
    } catch (err) {
      alert('Failed to update activity: ' + err.message);
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await deleteActivity(id);
      showToast('Activity deleted');
      loadData();
    } catch (err) {
      alert('Failed to delete activity: ' + err.message);
    }
  };

  if (authLoading) {
    return (
      <div className="loading-spinner" style={{ minHeight: '100vh' }}>
        <RefreshCw size={20} className="spin" />
        <span>Loading workspace...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  // Filter activities by client search query
  const filteredActivities = activities.filter((act) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      act.title.toLowerCase().includes(q) ||
      (act.description && act.description.toLowerCase().includes(q)) ||
      (act.category && act.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="app-layout">
      {/* Notion-style Left Sidebar */}
      <Sidebar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        summary={summary}
      />

      {/* Main Workspace */}
      <main className="main-content">
        {/* Notion-like Cover & Title Header */}
        <header className="page-header">
          <div className="page-icon-wrapper">📅</div>
          <h1 className="page-title">Daily Schedule</h1>
          <p className="page-description">
            Focus on what matters today, {user?.name}. Your activities are private to your account.
          </p>

          {/* Daily Progress Tracker */}
          <ProgressBar summary={summary} />
        </header>

        {/* Date Navigator & Day Picker */}
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* Views & Search Toolbar */}
        <div className="toolbar-row">
          <div className="view-tabs">
            <button
              type="button"
              className={`view-tab ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={14} />
              <span>List</span>
            </button>

            <button
              type="button"
              className={`view-tab ${viewMode === 'board' ? 'active' : ''}`}
              onClick={() => setViewMode('board')}
            >
              <Kanban size={14} />
              <span>Board</span>
            </button>

            <button
              type="button"
              className={`view-tab ${viewMode === 'timeline' ? 'active' : ''}`}
              onClick={() => setViewMode('timeline')}
            >
              <Clock size={14} />
              <span>Timeline</span>
            </button>
          </div>

          <div className="toolbar-actions">
            {/* Search Input */}
            <div className="search-input-wrap">
              <Search size={13} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Quick Status Dropdown */}
            <select
              className="select-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
            </select>

            {/* Quick Refresh */}
            <button
              type="button"
              className="btn-icon-subtle"
              onClick={loadData}
              title="Refresh schedule"
            >
              <RefreshCw size={13} className={loading ? 'spin' : ''} />
            </button>
          </div>
        </div>

        {/* Quick Add Bar */}
        <QuickAddBar
          selectedDate={selectedDate}
          onAddActivity={handleAddActivity}
        />

        {/* Main Content State Handling */}
        {error ? (
          <div
            style={{
              padding: '24px',
              borderRadius: '8px',
              background: '#fbe4e4',
              color: '#6e3630',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '13.5px',
              margin: '20px 0',
            }}
          >
            <AlertCircle size={20} />
            <div>
              <strong>Notice:</strong> {error}
            </div>
          </div>
        ) : loading && activities.length === 0 ? (
          <div className="loading-spinner">
            <RefreshCw size={16} className="spin" />
            <span>Loading schedule...</span>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <div className="empty-title">No activities found</div>
            <div className="empty-subtitle">
              {searchQuery
                ? `No items match "${searchQuery}"`
                : statusFilter !== 'ALL'
                ? `No activities marked as ${statusFilter.toLowerCase().replace('_', ' ')}`
                : 'Click "+ Add activity to schedule" above to plan your day.'}
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="activity-list">
            {filteredActivities.map((act) => (
              <ActivityItem
                key={act.id}
                activity={act}
                onStatusChange={handleStatusChange}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
              />
            ))}
          </div>
        ) : viewMode === 'board' ? (
          <ActivityBoard
            activities={filteredActivities}
            onStatusChange={handleStatusChange}
            onEdit={handleEditActivity}
            onDelete={handleDeleteActivity}
          />
        ) : (
          <TimelineView
            activities={filteredActivities}
            onStatusChange={handleStatusChange}
            onEdit={handleEditActivity}
          />
        )}
      </main>

      {/* Notion-style Activity Detail Modal */}
      <ActivityModal
        activity={editingActivity}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingActivity(null);
        }}
        onSave={handleSaveModal}
        onDelete={handleDeleteActivity}
      />

      {/* Floating Minimal Toast notification */}
      {toast && (
        <div className="toast">
          <CheckCircle2 size={15} color="#27ae60" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ScheduleWorkspace />
    </AuthProvider>
  );
}
