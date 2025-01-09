'use client'
import { tenantsOptions } from '@/apis'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function TenantsCheck() {
  const router = useRouter()
  const { data } = useSuspenseQuery(tenantsOptions)

  useEffect(() => {
    if (!data?.data || data.data.length === 0) {
      router.push('/create-tenant')
    }
  }, [data, router])

  return null
}
