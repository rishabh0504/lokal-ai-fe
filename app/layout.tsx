'use client'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ToastProvider } from '@/components/ui/toast'
import { Toaster } from '@/components/ui/toaster'
import { ClerkProvider, SignIn, useUser } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { ReactNode } from 'react'
import { AppSidebar } from './components/app-sidebar'
import { ReduxProvider } from './components/providers'
import { ThemeProvider } from './components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <head>
          <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
          <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
          <link rel="manifest" href="/favicon/site.webmanifest" />
        </head>
        <body className={inter.className}>
          <ToastProvider />
          <Toaster />
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthWrapper>{children}</AuthWrapper>
            </ThemeProvider>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}

function AuthWrapper({ children }: { children: ReactNode }) {
  const { isSignedIn } = useUser()

  if (isSignedIn) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="overflow-x-auto overflow-y-hidden">
          <main>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    )
  } else {
    return (
      <div className="flex justify-center items-center h-screen">
        <SignIn />
      </div>
    )
  }
}
