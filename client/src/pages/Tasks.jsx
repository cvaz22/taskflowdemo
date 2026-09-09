import { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import { useTeam } from '../hooks/useTeam';
import { useApi } from '../hooks/useApi';
import TaskRow from '../components/tasks/TaskRow';
import TaskBoard from '../components/tasks/TaskBoard';
import TaskForm from '../components/tasks/TaskForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';
import { api } from '../utils/api-client';

const headerRowStyle = {
  display: 'grid',
  gridTemplateColumns: '1fr 120px 100px 140px 100px',
  gap: 'var(--space-3)',
  padding: 'var(--space-2) var(--space-4)',
  fontSize: 'var(--font-size-xs)',
  fontWeight: 'var(--font-weight-semibold)',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  borderBottom: '2px solid var(--color-border)',
};

export default function Tasks() {
  const [view, setView] = useState('list');
  const [filters, setFilters] = useState({});
  const [showForm, setShowForm] = useState(false);
  const { data: tasks, loading, refetch } = useTasks(filters);
  const { data: teamMembers } = useTeam();
  const { data: projects } = useApi('/projects');

  const handleCreate = async (taskData) => {
    await api.post('/tasks', taskData);
    setShowForm(false);
    refetch();
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1>Tasks</h1>
          <p>Track and manage all tasks</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('list')}>List</Button>
          <Button variant={view === 'board' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('board')}>Board</Button>
          <Button onClick={() => setShowForm(true)}>+ New Task</Button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
        <select
          style={{ padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)' }}
          value={filters.status || ''}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value || undefined }))}
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in-progress">In Progress</option>
          <option value="in-review">In Review</option>
          <option value="done">Done</option>
        </select>
        <select
          style={{ padding: 'var(--space-1) var(--space-2)', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--color-border)', fontSize: 'var(--font-size-sm)' }}
          value={filters.priority || ''}
          onChange={(e) => setFilters((f) => ({ ...f, priority: e.target.value || undefined }))}
        >
          <option value="">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {view === 'list' ? (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={headerRowStyle}>
            <span>Task</span>
            <span>Assignee</span>
            <span>Status</span>
            <span>Priority</span>
            <span>Due</span>
          </div>
          {tasks?.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
          {tasks?.length === 0 && (
            <p style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>No tasks yet — create your first one to get started</p>
          )}
        </div>
      ) : (
        <TaskBoard tasks={tasks} />
      )}

      <Modal isOpen={showForm} onClose={() => setShowForm(false)} title="New Task">
        <TaskForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          teamMembers={teamMembers}
          projects={projects}
        />
      </Modal>
    </div>
  );
}
