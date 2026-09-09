import { useState } from 'react';
import ExpandableRows from './variants/ExpandableRows';
import SlideOutPanel from './variants/SlideOutPanel';
import ModalDeepDive from './variants/ModalDeepDive';
import Spinner from '../common/Spinner';
import Button from '../common/Button';

const tabs = [
  { id: 'expandable', label: 'Expandable Rows', Component: ExpandableRows },
  { id: 'slideout', label: 'Slide-Out Panel', Component: SlideOutPanel },
  { id: 'modal', label: 'Modal Deep-Dive', Component: ModalDeepDive },
];

export default function WorkloadTabs({ members, loading, error, refetch }) {
  const [activeTab, setActiveTab] = useState('expandable');

  const ActiveComponent = tabs.find((t) => t.id === activeTab).Component;

  return (
    <div>
      <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? 'secondary' : 'ghost'}
            size="small"
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {loading && <Spinner />}

      {!loading && error && (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <p style={{ color: 'var(--color-error)', marginBottom: 'var(--space-3)' }}>
            Couldn't load workload data.
          </p>
          <Button variant="secondary" size="small" onClick={refetch}>Retry</Button>
        </div>
      )}

      {!loading && !error && <ActiveComponent members={members} />}
    </div>
  );
}
