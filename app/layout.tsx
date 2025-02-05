import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import { Metadata } from 'next/types'
import { AppSidebar } from './components/app-sidebar'
import { ReduxProvider } from './components/providers'
import { ThemeProvider } from './components/theme-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lokal-AI',
  description: 'A brief description of your page',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
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
