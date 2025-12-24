import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { ApiResponse } from '../types';

/**
 * Hook genérico para fazer queries com React Query
 * 
 * @example
 * const { data, isLoading, error } = useApiQuery({
 *   queryKey: ['home', 'data'],
 *   queryFn: () => homeService.getData(),
 * });
 */
export const useApiQuery = <T>(
  options: Omit<UseQueryOptions<ApiResponse<T>, Error, T>, 'queryKey' | 'queryFn'> & {
    queryKey: (string | number)[];
    queryFn: () => Promise<ApiResponse<T>>;
  }
) => {
  return useQuery<ApiResponse<T>, Error, T>({
    ...options,
    select: (data) => data?.data, // Extrai apenas o campo 'data' da resposta
  });
};

