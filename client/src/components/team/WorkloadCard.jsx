import Badge from '../common/Badge';

const cardStyle = (overloaded) => ({
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderLeft: overloaded ? '3px solid var(--color-error)' : '3px solid transparent',
  borderRadius: 'var(--border-radius-lg)',
  padding: 'var(--space-5)',
  cursor: 'pointer',
  transition: 'background var(--transition-fast)',
});

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--space-3)',
  marginBottom: 'var(--space-3)',
};

const avatarStyle = (color) => ({
  width: '40px',
  height: '40px',
  borderRadius: 'var(--border-radius-full)',
  background: color || 'var(--color-primary)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  fontWeight: 'var(--font-weight-semibold)',
  fontSize: 'var(--font-size-sm)',
  flexShrink: 0,
});

const priorityOrder = ['urgent', 'high', 'medium', 'low'];

export default function WorkloadCard({ member, selected, onClick }) {
  const initials = member.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div
      style={{
        ...cardStyle(member.overloaded),
        background: selected ? 'var(--color-surface-hover)' : cardStyle(member.overloaded).background,
      }}
      onClick={() => onClick?.(member)}
    >
      <div style={headerStyle}>
        <div style={avatarStyle(member.avatar_color)}>{initials}</div>
        <div>
          <div style={{ fontWeight: 'var(--font-weight-semibold)' }}>{member.name}</div>
          <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>{member.role}</div>
        </div>
        {member.overloaded && (
          <span style={{
            marginLeft: 'auto',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--color-error)',
            background: 'var(--color-error-light)',
            padding: '2px 8px',
            borderRadius: 'var(--border-radius-full)',
            whiteSpace: 'nowrap',
          }}>
            Overloaded
          </span>
        )}
      </div>

      {member.totalOpen === 0 ? (
        <span style={{
          fontSize: 'var(--font-size-sm)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-success)',
        }}>
          Available — no open tasks
        </span>
      ) : (
        <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
          {priorityOrder
            .filter((p) => member.counts[p] > 0)
            .map((p) => (
              <span key={p} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                  {member.counts[p]}
                </span>
                <Badge value={p} />
              </span>
            ))}
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', alignSelf: 'center' }}>
            {member.totalOpen} open total
          </span>
        </div>
      )}
    </div>
  );
}
