"use client"

import { Button } from "@/components/ui/button"
import { Grid, List, Settings } from 'lucide-react'
import { useDrive } from '../context/drive-context'
import Breadcrumb from './breadcrumb'
import FileUpload from './file-upload'

interface HeaderProps {
  viewMode: 'list' | 'grid'
  setViewMode: (mode: 'list' | 'grid') => void
}

export default function Header({ viewMode, setViewMode }: HeaderProps) {
  const { currentFolder } = useDrive()

  return (
    <header className="border-b px-6 py-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">{currentFolder}</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')}>
            <Grid size={18} className={viewMode === 'grid' ? 'text-primary' : ''} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setViewMode('list')}>
            <List size={18} className={viewMode === 'list' ? 'text-primary' : ''} />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings size={18} />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Breadcrumb />
      </div>
      <div className="mt-4">
        <FileUpload />
      </div>
    </header>
  )
}

