"use client"

import { useState } from 'react'
import { useDrive } from '../context/drive-context'
import FileList from '../components/file-list'
import { SearchBar } from '../components/search-bar'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')
  const { getRecentFiles } = useDrive()
  const router = useRouter()

  const recentFiles = getRecentFiles(5)

  const handleSearch = (query: string) => {
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-4">Bienvenido a Google Drive Clone</h1>
        <SearchBar onSearch={handleSearch} />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Acceso rápido</h2>
        <FileList viewMode={viewMode} files={recentFiles} />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Archivos recientes</h2>
        <FileList viewMode={viewMode} files={recentFiles} />
      </div>
    </div>
  )
}

