'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TIERS, getUsagePercentage, type TierKey } from '@/lib/billing'
import { formatNumber } from '@/lib/utils'

interface UsageMeterProps {
  used: number
  tier: TierKey
}

export function UsageMeter({ used, tier }: UsageMeterProps) {
  const limit = TIERS[tier].monthlyEvents
  const percentage = getUsagePercentage(used, tier)
  const isWarning = percentage >= 80
  const isOver = percentage >= 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Usage This Month</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Events used</span>
          <span className="font-medium">
            {formatNumber(used)} / {formatNumber(limit)}
          </span>
        </div>
        <Progress
          value={percentage}
          className={isOver ? '[&>div]:bg-red-500' : isWarning ? '[&>div]:bg-yellow-500' : ''}
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{percentage}% used</span>
          <span>{formatNumber(Math.max(0, limit - used))} remaining</span>
        </div>
        {isOver && tier !== 'enterprise' && (
          <p className="text-xs text-red-600">
            You have exceeded your monthly limit. Overage charges may apply.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
