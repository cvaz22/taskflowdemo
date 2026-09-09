import { useApi } from './useApi';

export function useMemberTasks(memberId) {
  return useApi(memberId ? `/team/${memberId}/tasks` : null, { skip: !memberId });
}
