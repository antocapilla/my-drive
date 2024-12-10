"use client"

import { ChevronRight } from 'lucide-react'
import { useDrive } from '../context/drive-context'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function Breadcrumb() {
  const { getPath, currentFolderId, moveFile } = useDrive()
  const router = useRouter()

  const breadcrumbs = getPath(currentFolderId)

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-blue-100')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-100')
  }

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-blue-100')
    const fileId = e.dataTransfer.getData('text/plain')
    if (fileId) {
      moveFile(fileId, folderId)
    }
  }

  const handleClick = (folderId: string) => {
    if (folderId === 'root') {
      router.push('/folders/root')
    } else {
      router.push(`/folders/${folderId}`)
    }
  }

  return (
    <div className="flex items-center space-x-2 mb-4">
      {breadcrumbs.map((folder, index) => (
        <div key={folder.id} className="flex items-center">
          {index > 0 && <ChevronRight size={16} className="mx-2 text-gray-400" />}
          <Button
            variant="ghost"
            className="hover:bg-gray-100 px-2 py-1 rounded"
            onClick={() => handleClick(folder.id)}
            onDragOver={(e) => handleDragOver(e, folder.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, folder.id)}
          >
            {folder.name}
          </Button>
        </div>
      ))}
    </div>
  )
}

