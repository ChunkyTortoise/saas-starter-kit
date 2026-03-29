'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const techStack = [
  'Next.js 15',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'Stripe',
  'shadcn/ui',
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function HeroSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-24 text-center">
      <motion.div
        variants={fadeUp}
        custom={0}
        initial="hidden"
        animate="visible"
        className="mb-4 inline-block"
      >
        <Badge variant="secondary">Open Source</Badge>
      </motion.div>

      <motion.h1
        variants={fadeUp}
        custom={1}
        initial="hidden"
        animate="visible"
        className="text-5xl font-bold tracking-tight sm:text-6xl"
      >
        The SaaS Starter Kit
        <br />
        <span className="text-primary">That Ships</span>
      </motion.h1>

      <motion.p
        variants={fadeUp}
        custom={2}
        initial="hidden"
        animate="visible"
        className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
      >
        Authentication, 3-tier pricing, usage metering, webhook security,
        and a billing portal. Everything you need to launch your SaaS in a weekend.
      </motion.p>

      <motion.div
        variants={fadeUp}
        custom={3}
        initial="hidden"
        animate="visible"
        className="mt-8 flex items-center justify-center gap-4"
      >
        <Link href="/signup">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Button size="lg">Start Free</Button>
          </motion.div>
        </Link>
        <a
          href="https://vercel.com/new/clone?repository-url=https://github.com/ChunkyTortoise/saas-starter-kit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            <Button size="lg" variant="outline">Deploy to Vercel</Button>
          </motion.div>
        </a>
      </motion.div>

      <motion.div
        variants={fadeUp}
        custom={4}
        initial="hidden"
        animate="visible"
        className="mt-8 flex flex-wrap items-center justify-center gap-2"
      >
        {techStack.map((tech) => (
          <Badge key={tech} variant="outline">{tech}</Badge>
        ))}
      </motion.div>
    </section>
  )
}
