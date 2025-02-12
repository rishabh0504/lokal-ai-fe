'use client'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
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
        <body className={inter.className}>
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
        <SidebarInset>
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
