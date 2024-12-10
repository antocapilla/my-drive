"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDrive } from '../context/drive-context'
import { Button } from "@/components/ui/button"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { File, Folder, MoreHorizontal, Download, Trash, Edit, Share, Plus, Move } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { SelectionToolbar } from './selection-toolbar'

interface FileListProps {
  viewMode: 'list' | 'grid'
  files?: ReturnType<typeof useDrive>['getCurrentFiles']
  highlightTerms?: (text: string) => React.ReactNode[]
}

export default function FileList({ viewMode, files, highlightTerms }: FileListProps) {
  const { 
    getCurrentFiles, 
    deleteFile, 
    moveFile, 
    currentFolderId, 
    addFolder,
    renameFile,
    downloadFile,
    getAllFolders
  } = useDrive()
  const [draggedFile, setDraggedFile] = useState<string | null>(null)
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const router = useRouter()

  const currentFiles = files || getCurrentFiles()
  const allFolders = getAllFolders()

  const handleFileClick = (e: React.MouseEvent, file: ReturnType<typeof getCurrentFiles>[number]) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      setSelectedFiles(prev => {
        const newSet = new Set(prev)
        if (newSet.has(file.id)) {
          newSet.delete(file.id)
        } else {
          newSet.add(file.id)
        }
        return newSet
      })
    } else if (!selectedFiles.size) {
      if (file.type === 'folder') {
        router.push(`/folders/${file.id}`)
      }
    }
  }

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    setDraggedFile(fileId)
    e.dataTransfer.setData('text/plain', fileId)
  }

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault()
    if (folderId !== draggedFile) {
      setDragOverFolder(folderId)
    }
  }

  const handleDragLeave = () => {
    setDragOverFolder(null)
  }

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    const fileId = e.dataTransfer.getData('text/plain')
    if (fileId && draggedFile && targetId !== fileId) {
      moveFile(fileId, targetId)
      toast.success('Archivo movido exitosamente')
    }
    setDraggedFile(null)
    setDragOverFolder(null)
  }

  const handleContextMenuAction = async (action: string, file: ReturnType<typeof getCurrentFiles>[number]) => {
    switch (action) {
      case 'newFolder':
        const name = prompt('Ingrese el nombre de la carpeta:')
        if (name) {
          addFolder(name)
          toast.success(`Carpeta "${name}" creada`)
        }
        break
      case 'share':
        toast.info(`Compartiendo "${file.name}" (No implementado)`)
        break
      case 'rename':
        const newName = prompt('Ingrese el nuevo nombre:', file.name)
        if (newName && newName !== file.name) {
          await renameFile(file.id, newName)
          toast.success(`"${file.name}" renombrado a "${newName}"`)
        }
        break
      case 'download':
        await downloadFile(file.id)
        toast.success(`Descargando "${file.name}"`)
        break
      case 'delete':
        if (confirm(`¿Está seguro de eliminar "${file.name}"?`)) {
          await deleteFile(file.id)
          toast.success(`"${file.name}" eliminado`)
        }
        break
    }
  }

  const handleSelectionToolbarAction = (action: string) => {
    switch (action) {
      case 'share':
        toast.info('Compartiendo archivos seleccionados (No implementado)')
        break
      case 'download':
        selectedFiles.forEach(fileId => {
          const file = currentFiles.find(f => f.id === fileId)
          if (file) downloadFile(file.id)
        })
        toast.success('Descargando archivos seleccionados')
        break
      case 'delete':
        if (confirm(`¿Está seguro de eliminar ${selectedFiles.size} elementos?`)) {
          selectedFiles.forEach(fileId => deleteFile(fileId))
          setSelectedFiles(new Set())
          toast.success('Elementos eliminados')
        }
        break
    }
  }

  const renderFileIcon = (file: ReturnType<typeof getCurrentFiles>[number]) => {
    const icon = file.type === 'folder' ? (
      <Folder className="h-4 w-4 text-blue-500" />
    ) : (() => {
      switch (file.name.split('.').pop()?.toLowerCase()) {
        case 'pdf':
          return <File className="h-4 w-4 text-red-500" />
        case 'doc':
        case 'docx':
          return <File className="h-4 w-4 text-blue-600" />
        case 'xls':
        case 'xlsx':
          return <File className="h-4 w-4 text-green-600" />
        case 'ppt':
        case 'pptx':
          return <File className="h-4 w-4 text-orange-500" />
        default:
          return <File className="h-4 w-4 text-gray-500" />
      }
    })()

    return (
      <>
        {icon}
        <span className="truncate">
          {highlightTerms ? highlightTerms(file.name) : file.name}
        </span>
      </>
    )
  }

  if (viewMode === 'grid') {
    return (
      <>
        <AnimatePresence>
          {selectedFiles.size > 0 && (
            <SelectionToolbar
              selectedCount={selectedFiles.size}
              onClose={() => setSelectedFiles(new Set())}
              onShare={() => handleSelectionToolbarAction('share')}
              onDownload={() => handleSelectionToolbarAction('download')}
              onDelete={() => handleSelectionToolbarAction('delete')}
            />
          )}
        </AnimatePresence>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
          {currentFiles.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger asChild>
                <motion.div
                  draggable={true}
                  onDragStart={(e) => handleDragStart(e, file.id)}
                  onDragOver={(e) => file.type === 'folder' ? handleDragOver(e, file.id) : undefined}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => file.type === 'folder' ? handleDrop(e, file.id) : undefined}
                  onClick={(e) => handleFileClick(e, file)}
                  className={`
                    flex flex-col items-center p-4 border rounded-lg cursor-pointer
                    ${selectedFiles.has(file.id) ? 'bg-blue-50 border-blue-200' : ''}
                    ${draggedFile === file.id ? 'opacity-50' : ''}
                    ${dragOverFolder === file.id ? 'bg-blue-100' : ''}
                    hover:bg-gray-100 transition-all duration-200
                  `}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {renderFileIcon(file)}
                </motion.div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => handleContextMenuAction('share', file)}>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Compartir</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextMenuAction('download', file)}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Descargar</span>
                </ContextMenuItem>
                <ContextMenuItem onClick={() => handleContextMenuAction('rename', file)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Renombrar</span>
                </ContextMenuItem>
                <ContextMenuSub>
                  <ContextMenuSubTrigger>
                    <Move className="mr-2 h-4 w-4" />
                    <span>Mover a</span>
                  </ContextMenuSubTrigger>
                  <ContextMenuSubContent>
                    {allFolders.map((folder) => (
                      <ContextMenuItem key={folder.id} onClick={() => moveFile(file.id, folder.id)}>
                        <Folder className="mr-2 h-4 w-4" />
                        <span>{folder.name}</span>
                      </ContextMenuItem>
                    ))}
                  </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => handleContextMenuAction('delete', file)}>
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Eliminar</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <AnimatePresence>
        {selectedFiles.size > 0 && (
          <SelectionToolbar
            selectedCount={selectedFiles.size}
            onClose={() => setSelectedFiles(new Set())}
            onShare={() => handleSelectionToolbarAction('share')}
            onDownload={() => handleSelectionToolbarAction('download')}
            onDelete={() => handleSelectionToolbarAction('delete')}
          />
        )}
      </AnimatePresence>
      <div className="min-h-full">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
              <th scope="col" className="py-3 pr-3">Nombre</th>
              <th scope="col" className="py-3 px-3 text-right">Tamaño</th>
              <th scope="col" className="py-3 px-3">Modificado</th>
              <th scope="col" className="py-3 pl-3 w-[32px]"></th>
            </tr>
          </thead>
          <tbody>
            {currentFiles.map((file) => (
              <ContextMenu key={file.id}>
                <ContextMenuTrigger asChild>
                  <motion.tr
                    draggable={true}
                    onDragStart={(e) => handleDragStart(e, file.id)}
                    onDragOver={(e) => file.type === 'folder' ? handleDragOver(e, file.id) : undefined}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => file.type === 'folder' ? handleDrop(e, file.id) : undefined}
                    onClick={(e) => handleFileClick(e, file)}
                    className={`
                      group border-b border-gray-100 text-sm cursor-pointer
                      ${selectedFiles.has(file.id) ? 'bg-blue-50' : ''}
                      ${draggedFile === file.id ? 'opacity-50' : ''}
                      ${dragOverFolder === file.id ? 'bg-blue-50' : ''}
                      hover:bg-gray-50 transition-colors
                    `}
                    whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                  >
                    <td className="py-2 pr-3">
                      <div className="flex items-center gap-2">
                        {renderFileIcon(file)}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-right text-gray-500">{file.size}</td>
                    <td className="py-2 px-3 text-gray-500">{file.modified}</td>
                    <td className="py-2 pl-3">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleContextMenuAction('share', file)}>
                    <Share className="mr-2 h-4 w-4" />
                    <span>Compartir</span>
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleContextMenuAction('download', file)}>
                    <Download className="mr-2 h-4 w-4" />
                    <span>Descargar</span>
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleContextMenuAction('rename', file)}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Renombrar</span>
                  </ContextMenuItem>
                  <ContextMenuSub>
                    <ContextMenuSubTrigger>
                      <Move className="mr-2 h-4 w-4" />
                      <span>Mover a</span>
                    </ContextMenuSubTrigger>
                    <ContextMenuSubContent>
                      {allFolders.map((folder) => (
                        <ContextMenuItem key={folder.id} onClick={() => moveFile(file.id, folder.id)}>
                          <Folder className="mr-2 h-4 w-4" />
                          <span>{folder.name}</span>
                        </ContextMenuItem>
                      ))}
                    </ContextMenuSubContent>
                  </ContextMenuSub>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => handleContextMenuAction('delete', file)}>
                    <Trash className="mr-2 h-4 w-4" />
                    <span>Eliminar</span>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

