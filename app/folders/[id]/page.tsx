"use client"

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useDrive } from '../../context/drive-context'
import FileList from '../../components/file-list'
import Header from '../../components/header'

export default function FolderPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const { id } = useParams()
  const { setCurrentFolder, getCurrentFiles } = useDrive()

  useEffect(() => {
    if (id) {
      setCurrentFolder(id as string)
    }
  }, [id, setCurrentFolder])

  const files = getCurrentFiles()

  return (
    <div className="flex h-screen bg-background">
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header viewMode={viewMode} setViewMode={setViewMode} />
        <main className="flex-1 overflow-auto p-4">
          <FileList viewMode={viewMode} files={files} />
        </main>
      </div>
    </div>
  )
}

