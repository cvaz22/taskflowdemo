const statCardStyle = (accentColor) => ({
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderTop: `3px solid ${accentColor}`,
  borderRadius: 'var(--border-radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  padding: 'var(--space-6)',
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-2)',
});

const labelStyle = {
  fontSize: 'var(--font-size-sm)',
  color: 'var(--color-text-secondary)',
  fontWeight: 'var(--font-weight-medium)',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const valueStyle = {
  fontSize: 'var(--font-size-3xl)',
  fontWeight: 'var(--font-weight-bold)',
  color: 'var(--color-text)',
};

export default function Stats({ tasks, projects }) {
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.status === 'done').length || 0;
  const inProgress = tasks?.filter((t) => t.status === 'in-progress').length || 0;
  const activeProjects = projects?.filter((p) => p.status === 'active').length || 0;

  const stats = [
    { label: 'Total Tasks', value: totalTasks, accent: 'var(--color-primary)' },
    // BUG: Typo — "Completd" instead of "Completed"
    { label: 'Completd Tasks', value: completedTasks, accent: 'var(--color-success)' },
    { label: 'In Progress', value: inProgress, accent: 'var(--color-info)' },
    { label: 'Active Projects', value: activeProjects, accent: 'var(--color-accent)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)' }}>
      {stats.map((stat) => (
        <div key={stat.label} style={statCardStyle(stat.accent)}>
          <span style={labelStyle}>{stat.label}</span>
          <span style={valueStyle}>{stat.value}</span>
        </div>
      ))}
    </div>
  );
}
