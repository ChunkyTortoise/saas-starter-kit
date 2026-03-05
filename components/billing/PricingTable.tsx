'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TIERS, type TierKey } from '@/lib/billing'

interface PricingTableProps {
  currentTier?: TierKey
  onSelect?: (tier: TierKey) => void
}

export function PricingTable({ currentTier, onSelect }: PricingTableProps) {
  const tiers = Object.entries(TIERS) as [TierKey, (typeof TIERS)[TierKey]][]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {tiers.map(([key, tier]) => {
        const isCurrent = currentTier === key
        const isPopular = key === 'pro'

        return (
          <Card
            key={key}
            className={isPopular ? 'border-primary shadow-lg relative' : 'relative'}
          >
            {isPopular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <CardHeader>
              <CardTitle>{tier.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold text-foreground">
                  ${tier.price}
                </span>
                {tier.price > 0 && (
                  <span className="text-muted-foreground">/month</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4 text-green-500 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={isCurrent ? 'outline' : isPopular ? 'default' : 'secondary'}
                disabled={isCurrent}
                onClick={() => onSelect?.(key)}
              >
                {isCurrent ? 'Current Plan' : tier.price === 0 ? 'Get Started' : 'Subscribe'}
              </Button>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
