"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronDown, Folder, HardDrive, Star, Trash, Clock, Users, Cloud } from 'lucide-react'
import { useDrive } from '../context/drive-context'
import { motion } from 'framer-motion'

type FolderTreeProps = {
  folderId: string
  level: number
}

function FolderTree({ folderId, level }: FolderTreeProps) {
  const { files, currentFolderId, moveFile } = useDrive()
  const [isOpen, setIsOpen] = useState(folderId === 'root')
  const router = useRouter()

  const folder = files.find(f => f.id === folderId)
  const subFolders = files.filter(f => f.parentId === folderId && f.type === 'folder')

  if (!folder) return null

  const handleClick = () => {
    setIsOpen(!isOpen)
    router.push(`/folders/${folder.id}`)
  }

  return (
    <div style={{ marginLeft: `${level * 12}px` }}>
      <div
        className={`flex items-center py-1 px-2 rounded-md cursor-pointer ${
          currentFolderId === folder.id ? 'bg-blue-100' : 'hover:bg-gray-100'
        }`}
        onClick={handleClick}
      >
        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1">
          {subFolders.length > 0 && (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <Folder className="h-4 w-4 text-blue-500 mr-2" />
        <span className="text-sm truncate">{folder.name}</span>
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {subFolders.map((subFolder) => (
            <FolderTree key={subFolder.id} folderId={subFolder.id} level={level + 1} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default function Sidebar() {
  const router = useRouter()

  return (
    <div className="w-64 bg-background h-full overflow-hidden">
      <ScrollArea className="h-full">
        <div className="p-2 space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start text-sm"
            onClick={() => router.push('/home')}
          >
            <HardDrive className="h-4 w-4 mr-2" />
            Mi unidad
          </Button>
          <FolderTree folderId="root" level={0} />
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            <Users className="h-4 w-4 mr-2" />
            Compartido conmigo
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            <Clock className="h-4 w-4 mr-2" />
            Reciente
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            <Star className="h-4 w-4 mr-2" />
            Destacados
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            <Trash className="h-4 w-4 mr-2" />
            Papelera
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-sm"
          >
            <Cloud className="h-4 w-4 mr-2" />
            Almacenamiento
          </Button>
        </div>
      </ScrollArea>
    </div>
  )
}

