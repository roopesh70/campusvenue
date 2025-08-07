
'use client';

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const LoginPageContent = dynamic(() => import('@/app/(auth)/login/LoginPageContent'), {
  ssr: false,
})

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<div />}>
          <LoginPageContent />
        </Suspense>
      </div>
    </div>
  )
}
