import { useState } from 'react';
import WorkloadCard from '../WorkloadCard';
import MemberTaskList from '../MemberTaskList';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 'var(--space-4)',
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.2)',
  zIndex: 90,
};

const panelStyle = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '400px',
  maxWidth: '90vw',
  background: 'var(--color-surface)',
  boxShadow: 'var(--shadow-lg)',
  padding: 'var(--space-6)',
  overflowY: 'auto',
  zIndex: 91,
};

const closeBtnStyle = {
  background: 'none',
  border: 'none',
  fontSize: 'var(--font-size-xl)',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  padding: 'var(--space-1)',
  lineHeight: 1,
};

export default function SlideOutPanel({ members }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div style={gridStyle}>
        {members.map((member) => (
          <WorkloadCard key={member.id} member={member} selected={selected?.id === member.id} onClick={setSelected} />
        ))}
      </div>

      {selected && (
        <>
          <div style={overlayStyle} onClick={() => setSelected(null)} />
          <div style={panelStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
              <h3>{selected.name}'s Tasks</h3>
              <button style={closeBtnStyle} onClick={() => setSelected(null)}>&times;</button>
            </div>
            <MemberTaskList memberId={selected.id} />
          </div>
        </>
      )}
    </>
  );
}
