"use client"

import React, { createContext, useContext, useState } from 'react'

type FileType = {
  id: string
  name: string
  type: 'file' | 'folder' | 'document' | 'image'
  size: string
  modified: string
  parentId: string | null
  content?: File
}

type DriveContextType = {
  files: FileType[]
  currentFolder: string
  currentFolderId: string | null
  addFile: (file: File) => void
  addFolder: (name: string) => void
  deleteFile: (id: string) => void
  setCurrentFolder: (folderId: string | null) => void
  getCurrentFiles: () => FileType[]
  moveFile: (fileId: string, newParentId: string) => void
  getPath: (folderId: string | null) => FileType[]
  renameFile: (id: string, newName: string) => Promise<void>
  downloadFile: (id: string) => Promise<void>
  getAllFolders: () => FileType[]
  searchFiles: (query: string) => Promise<FileType[]>
  getRecentFiles: (limit?: number) => FileType[]
  // Funciones para futura integración con backend
  fetchFiles: () => Promise<void>
  uploadFile: (file: File) => Promise<void>
  updateFile: (id: string, updates: Partial<FileType>) => Promise<void>
  highlightSearchTerms: (text: string, searchTerms: string[]) => React.ReactNode[]
}

const DriveContext = createContext<DriveContextType | undefined>(undefined)

export const useDrive = () => {
  const context = useContext(DriveContext)
  if (!context) {
    throw new Error('useDrive must be used within a DriveProvider')
  }
  return context
}

export const DriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<FileType[]>([
    { id: 'root', name: "My Drive", type: "folder", size: "-", modified: "May 8, 2023", parentId: null },
    { id: '1', name: "Documents", type: "folder", size: "-", modified: "May 8, 2023", parentId: 'root' },
    { id: '2', name: "Images", type: "folder", size: "-", modified: "Apr 22, 2023", parentId: 'root' },
    { id: '3', name: "Project Proposal.docx", type: "document", size: "2.3 MB", modified: "May 10, 2023", parentId: 'root' },
    { id: '4', name: "Budget.xlsx", type: "document", size: "1.8 MB", modified: "May 9, 2023", parentId: 'root' },
    { id: '5', name: "Presentation.pptx", type: "document", size: "5.2 MB", modified: "May 7, 2023", parentId: 'root' },
    { id: '6', name: "Logo.png", type: "image", size: "0.5 MB", modified: "May 11, 2023", parentId: '2' },
  ])
  const [currentFolderId, setCurrentFolderId] = useState<string | null>('root')

  const addFile = (file: File) => {
    const newFile: FileType = {
      id: Date.now().toString(),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      modified: new Date().toLocaleDateString(),
      parentId: currentFolderId,
      content: file
    }
    setFiles(prev => [...prev, newFile])
  }

  const addFolder = (name: string) => {
    const newFolder: FileType = {
      id: Date.now().toString(),
      name,
      type: 'folder',
      size: '-',
      modified: new Date().toLocaleDateString(),
      parentId: currentFolderId
    }
    setFiles(prev => [...prev, newFolder])
  }

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id && file.parentId !== id))
  }

  const setCurrentFolder = (folderId: string | null) => {
    setCurrentFolderId(folderId)
  }

  const getCurrentFiles = () => {
    return files.filter(file => file.parentId === currentFolderId)
  }

  const moveFile = (fileId: string, newParentId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, parentId: newParentId } : file
    ))
  }

  const getPath = (folderId: string | null): FileType[] => {
    const path: FileType[] = []
    let currentId = folderId

    while (currentId) {
      const folder = files.find(f => f.id === currentId)
      if (folder) {
        path.unshift(folder)
        currentId = folder.parentId
      } else {
        break
      }
    }

    return path
  }

  const renameFile = async (id: string, newName: string) => {
    setFiles(prev => prev.map(file =>
      file.id === id ? { ...file, name: newName } : file
    ))
  }

  const downloadFile = async (id: string) => {
    const file = files.find(f => f.id === id)
    if (file && file.content) {
      const url = URL.createObjectURL(file.content)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const getAllFolders = () => {
    return files.filter(file => file.type === 'folder')
  }

  const searchFiles = async (query: string): Promise<FileType[]> => {
    if (!query.trim()) return []
    
    const searchTerms = query.toLowerCase().split(' ')
    return files.filter(file => 
      searchTerms.every(term => 
        file.name.toLowerCase().includes(term) ||
        file.type.toLowerCase().includes(term)
      )
    )
  }

  const highlightSearchTerms = (text: string, searchTerms: string[]): React.ReactNode[] => {
    const parts = text.split(new RegExp(`(${searchTerms.join('|')})`, 'gi'))
    return parts.map((part, i) => 
      searchTerms.some(term => part.toLowerCase() === term.toLowerCase()) 
        ? <mark key={i} className="bg-yellow-200">{part}</mark>
        : part
    )
  }

  const getRecentFiles = (limit: number = 5): FileType[] => {
    return [...files]
      .sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
      .slice(0, limit)
  }

  const fetchFiles = async () => {
    // TODO: Implementar la lógica para obtener archivos del backend
    console.log('Fetching files from backend...')
  }

  const uploadFile = async (file: File) => {
    // TODO: Implementar la lógica para subir archivos al backend
    console.log('Uploading file to backend...', file.name)
    addFile(file)
  }

  const updateFile = async (id: string, updates: Partial<FileType>) => {
    // TODO: Implementar la lógica para actualizar archivos en el backend
    console.log('Updating file in backend...', id, updates)
    setFiles(prev => prev.map(file => file.id === id ? { ...file, ...updates } : file))
  }

  const currentFolder = files.find(f => f.id === currentFolderId)?.name || 'My Drive'

  return (
    <DriveContext.Provider value={{ 
      files, 
      currentFolder, 
      currentFolderId, 
      addFile, 
      addFolder, 
      deleteFile, 
      setCurrentFolder, 
      getCurrentFiles,
      moveFile,
      getPath,
      renameFile,
      downloadFile,
      getAllFolders,
      searchFiles,
      highlightSearchTerms,
      getRecentFiles,
      fetchFiles,
      uploadFile,
      updateFile
    }}>
      {children}
    </DriveContext.Provider>
  )
}

