"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, ChevronDown, Folder, HardDrive, Star, Trash, ChevronLeft, ChevronRightIcon as ChevronRightExpand } from 'lucide-react'
import { useDrive } from '../context/drive-context'
import { motion, AnimatePresence } from 'framer-motion'

type FolderTreeProps = {
  folderId: string
  level: number
}

function FolderTree({ folderId, level }: FolderTreeProps) {
  const { files, setCurrentFolder, currentFolderId, moveFile } = useDrive()
  const [isOpen, setIsOpen] = useState(folderId === 'root')

  const folder = files.find(f => f.id === folderId)
  const subFolders = files.filter(f => f.parentId === folderId && f.type === 'folder')

  if (!folder) return null

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add('bg-blue-100')
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-100')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove('bg-blue-100')
    const fileId = e.dataTransfer.getData('text/plain')
    if (fileId) {
      moveFile(fileId, folderId)
    }
  }

  return (
    <div style={{ marginLeft: `${level * 16}px` }}>
      <div
        className={`flex items-center py-1 px-2 rounded-md cursor-pointer ${
          currentFolderId === folder.id ? 'bg-blue-100' : 'hover:bg-gray-100'
        }`}
        onClick={() => {
          setIsOpen(!isOpen)
          setCurrentFolder(folder.id)
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Button variant="ghost" size="icon" className="h-5 w-5 p-0 mr-1">
          {subFolders.length > 0 && (
            isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <Folder className="h-4 w-4 text-blue-500 mr-2" />
        <span className="text-sm truncate">{folder.name}</span>
      </div>
      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar() {
  const { files, setCurrentFolder, currentFolderId } = useDrive()
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <motion.div
      className="bg-white border-r"
      initial={false}
      animate={{ width: isExpanded ? 240 : 64 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-end p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 w-8"
        >
          {isExpanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRightExpand className="h-4 w-4" />}
        </Button>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ScrollArea className="h-[calc(100vh-4rem)]">
              <div className="p-2 space-y-2">
                <Button
                  variant={currentFolderId === 'root' ? 'secondary' : 'ghost'}
                  className="w-full justify-start text-sm"
                  onClick={() => setCurrentFolder('root')}
                >
                  <HardDrive className="h-4 w-4 mr-2" />
                  My Drive
                </Button>
                <FolderTree folderId="root" level={0} />
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Starred
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm"
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Trash
                </Button>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

