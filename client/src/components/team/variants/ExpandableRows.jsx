import { useState } from 'react';
import WorkloadCard from '../WorkloadCard';
import MemberTaskList from '../MemberTaskList';

const gridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-3)',
};

export default function ExpandableRows({ members }) {
  const [expandedId, setExpandedId] = useState(null);

  const toggle = (member) => {
    setExpandedId((current) => (current === member.id ? null : member.id));
  };

  return (
    <div style={gridStyle}>
      {members.map((member) => (
        <div key={member.id}>
          <WorkloadCard member={member} selected={expandedId === member.id} onClick={toggle} />
          {expandedId === member.id && (
            <div style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              borderTop: 'none',
              borderRadius: '0 0 var(--border-radius-lg) var(--border-radius-lg)',
              padding: 'var(--space-4) var(--space-5)',
              marginTop: '-1px',
            }}>
              <MemberTaskList memberId={member.id} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
