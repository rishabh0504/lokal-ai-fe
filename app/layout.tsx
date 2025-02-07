'use client'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { AppSidebar } from './components/app-sidebar'
import { ReduxProvider } from './components/providers'
import { ThemeProvider } from './components/theme-provider'
import './globals.css'
import { ReactNode } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ReduxProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                  <main>{children}</main>
                </SidebarInset>
              </SidebarProvider>
            </ThemeProvider>
          </ReduxProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
