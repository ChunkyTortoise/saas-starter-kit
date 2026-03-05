'use client'

import { Badge } from '@/components/ui/badge'
import type { TierKey } from '@/lib/billing'

const tierStyles: Record<TierKey, string> = {
  free: 'bg-gray-100 text-gray-800 border-gray-200',
  pro: 'bg-blue-100 text-blue-800 border-blue-200',
  enterprise: 'bg-purple-100 text-purple-800 border-purple-200',
}

const tierLabels: Record<TierKey, string> = {
  free: 'Free',
  pro: 'Pro',
  enterprise: 'Enterprise',
}

export function PlanBadge({ tier }: { tier: TierKey }) {
  return (
    <Badge className={tierStyles[tier]} variant="outline">
      {tierLabels[tier]}
    </Badge>
  )
}
