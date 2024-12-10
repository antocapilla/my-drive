import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { DriveProvider } from './context/drive-context'
import { MainHeader } from './components/main-header'
import Sidebar from './components/sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Google Drive Clone',
  description: 'A simple Google Drive clone built with Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DriveProvider>
          <div className="flex flex-col h-screen">
            <MainHeader />
            <div className="flex flex-1 overflow-hidden">
              <Sidebar />
              <div className="flex-1 overflow-auto border-l border-border">
                {children}
              </div>
            </div>
          </div>
          <Toaster />
        </DriveProvider>
      </body>
    </html>
  )
}

