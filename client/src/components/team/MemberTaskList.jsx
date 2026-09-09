import Badge from '../common/Badge';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { useMemberTasks } from '../../hooks/useMemberTasks';
import { formatRelativeDate } from '../../utils/format-date';

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 'var(--space-3) 0',
  borderBottom: '1px solid var(--color-border-light)',
};

export default function MemberTaskList({ memberId }) {
  const { data: tasks, loading, error, refetch } = useMemberTasks(memberId);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
        <p style={{ color: 'var(--color-error)', marginBottom: 'var(--space-3)' }}>
          Couldn't load this member's tasks.
        </p>
        <Button variant="secondary" size="small" onClick={refetch}>Retry</Button>
      </div>
    );
  }

  if (!tasks?.length) {
    return (
      <p style={{ color: 'var(--color-success)', fontWeight: 'var(--font-weight-medium)', padding: 'var(--space-4) 0' }}>
        Available — no tasks assigned
      </p>
    );
  }

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} style={rowStyle}>
          <div>
            <div style={{ fontWeight: 'var(--font-weight-medium)', fontSize: 'var(--font-size-sm)' }}>{task.title}</div>
            <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>{task.project_name}</div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <Badge value={task.status} />
            <Badge value={task.priority} />
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', minWidth: '70px', textAlign: 'right' }}>
              {formatRelativeDate(task.due_date)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
