import { useState } from 'react';
import { useTeam } from '../hooks/useTeam';
import { useWorkload } from '../hooks/useWorkload';
import MemberList from '../components/team/MemberList';
import WorkloadTabs from '../components/team/WorkloadTabs';
import Button from '../components/common/Button';
import Spinner from '../components/common/Spinner';

export default function Team() {
  const [view, setView] = useState('list');
  const { data: members, loading } = useTeam();
  const { data: workload, loading: workloadLoading, error: workloadError, refetch: refetchWorkload } = useWorkload();

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h1>Team</h1>
          <p>Your product team members</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant={view === 'list' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('list')}>List</Button>
          <Button variant={view === 'workload' ? 'secondary' : 'ghost'} size="small" onClick={() => setView('workload')}>Workload</Button>
        </div>
      </div>

      {view === 'list' ? (
        <MemberList members={members} />
      ) : (
        <WorkloadTabs members={workload} loading={workloadLoading} error={workloadError} refetch={refetchWorkload} />
      )}
    </div>
  );
}
