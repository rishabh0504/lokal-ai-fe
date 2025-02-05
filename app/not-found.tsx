'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background">
      <Image src="/assets/404.png" alt="Page Not Found" width={500} height={300} className="mb-8" />
      <Button asChild variant="outline">
        <Link href="/">Go to Homepage</Link>
      </Button>
    </div>
  )
}
