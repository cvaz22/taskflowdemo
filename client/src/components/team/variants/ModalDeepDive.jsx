import { useState } from 'react';
import WorkloadCard from '../WorkloadCard';
import MemberTaskList from '../MemberTaskList';
import Modal from '../../common/Modal';

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 'var(--space-4)',
};

export default function ModalDeepDive({ members }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div style={gridStyle}>
        {members.map((member) => (
          <WorkloadCard key={member.id} member={member} onClick={setSelected} />
        ))}
      </div>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected ? `${selected.name}'s Tasks` : ''}>
        {selected && <MemberTaskList memberId={selected.id} />}
      </Modal>
    </>
  );
}
