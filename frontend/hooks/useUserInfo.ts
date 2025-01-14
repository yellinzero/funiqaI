import { meOptions } from '@/apis'
import { useSuspenseQuery } from '@tanstack/react-query'

export function useUserInfo() {
  const { data } = useSuspenseQuery(meOptions)
  return data?.data ?? null
}
