import { useApi } from './useApi';

export function useWorkload() {
  return useApi('/team/workload');
}
