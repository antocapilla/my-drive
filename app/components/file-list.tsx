'use client';

import { useState } from 'react';
import { useDrive } from '../context/drive-context';
import { Button } from '@/components/ui/button';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import {
  File,
  Folder,
  MoreHorizontal,
  Download,
  Trash,
  Edit,
  Share,
  Plus,
  Move,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function FileList({ viewMode }: { viewMode: 'list' | 'grid' }) {
  const {
    getCurrentFiles,
    deleteFile,
    setCurrentFolder,
    moveFile,
    currentFolderId,
    addFolder,
    renameFile,
    downloadFile,
    getAllFolders,
  } = useDrive();
  const [draggedFile, setDraggedFile] = useState<string | null>(null);
  const [dragOverFolder, setDragOverFolder] = useState<string | null>(null);

  const currentFiles = getCurrentFiles();
  const allFolders = getAllFolders();

  const handleFileClick = (
    file: ReturnType<typeof getCurrentFiles>[number]
  ) => {
    if (file.type === 'folder') {
      setCurrentFolder(file.id);
    }
  };

  const handleDragStart = (e: React.DragEvent, fileId: string) => {
    setDraggedFile(fileId);
    e.dataTransfer.setData('text/plain', fileId);
  };

  const handleDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (folderId !== draggedFile) {
      setDragOverFolder(folderId);
    }
  };

  const handleDragLeave = () => {
    setDragOverFolder(null);
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const fileId = e.dataTransfer.getData('text/plain');
    if (fileId && draggedFile && targetId !== fileId) {
      moveFile(fileId, targetId);
      toast.success('File moved successfully');
    }
    setDraggedFile(null);
    setDragOverFolder(null);
  };

  const renderFileIcon = (file: ReturnType<typeof getCurrentFiles>[number]) => {
    if (file.type === 'folder') {
      return <Folder className="h-4 w-4 text-blue-500" />;
    }
    switch (file.name.split('.').pop()?.toLowerCase()) {
      case 'pdf':
        return <File className="h-4 w-4 text-red-500" />;
      case 'doc':
      case 'docx':
        return <File className="h-4 w-4 text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <File className="h-4 w-4 text-green-600" />;
      case 'ppt':
      case 'pptx':
        return <File className="h-4 w-4 text-orange-500" />;
      default:
        return <File className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleContextMenuAction = async (
    action: string,
    file: ReturnType<typeof getCurrentFiles>[number]
  ) => {
    switch (action) {
      case 'newFolder':
        const name = prompt('Enter folder name:');
        if (name) {
          addFolder(name);
          toast.success(`Folder "${name}" created`);
        }
        break;
      case 'share':
        toast.info(`Sharing "${file.name}" (Not implemented)`);
        break;
      case 'rename':
        const newName = prompt('Enter new name:', file.name);
        if (newName && newName !== file.name) {
          await renameFile(file.id, newName);
          toast.success(`Renamed "${file.name}" to "${newName}"`);
        }
        break;
      case 'download':
        await downloadFile(file.id);
        toast.success(`Downloading "${file.name}"`);
        break;
      case 'delete':
        if (confirm(`Are you sure you want to delete "${file.name}"?`)) {
          await deleteFile(file.id);
          toast.success(`"${file.name}" deleted`);
        }
        break;
      case 'move':
        // This will be handled in the sub-menu
        break;
    }
  };

  const renderContextMenu = (
    file: ReturnType<typeof getCurrentFiles>[number]
  ) => (
    <ContextMenuContent>
      <ContextMenuItem
        onClick={() => handleContextMenuAction('newFolder', file)}
      >
        <Plus className="mr-2 h-4 w-4" />
        <span>New Folder</span>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => handleContextMenuAction('share', file)}>
        <Share className="mr-2 h-4 w-4" />
        <span>Share</span>
      </ContextMenuItem>
      <ContextMenuItem onClick={() => handleContextMenuAction('rename', file)}>
        <Edit className="mr-2 h-4 w-4" />
        <span>Rename</span>
      </ContextMenuItem>
      <ContextMenuItem
        onClick={() => handleContextMenuAction('download', file)}
      >
        <Download className="mr-2 h-4 w-4" />
        <span>Download</span>
      </ContextMenuItem>
      <ContextMenuSub>
        <ContextMenuSubTrigger>
          <Move className="mr-2 h-4 w-4" />
          <span>Move to</span>
        </ContextMenuSubTrigger>
        <ContextMenuSubContent>
          {allFolders.map((folder) => (
            <ContextMenuItem
              key={folder.id}
              onClick={() => moveFile(file.id, folder.id)}
            >
              <Folder className="mr-2 h-4 w-4" />
              <span>{folder.name}</span>
            </ContextMenuItem>
          ))}
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={() => handleContextMenuAction('delete', file)}>
        <Trash className="mr-2 h-4 w-4" />
        <span>Delete</span>
      </ContextMenuItem>
    </ContextMenuContent>
  );

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
        {currentFiles.map((file) => (
          <ContextMenu key={file.id}>
            <ContextMenuTrigger asChild>
              <motion.div
                draggable={true}
                onDragStart={(e) => handleDragStart(e, file.id)}
                onDragOver={(e) =>
                  file.type === 'folder'
                    ? handleDragOver(e, file.id)
                    : undefined
                }
                onDragLeave={handleDragLeave}
                onDrop={(e) =>
                  file.type === 'folder' ? handleDrop(e, file.id) : undefined
                }
                onClick={() => handleFileClick(file)}
                className={`
                  flex flex-col items-center p-4 border rounded-lg cursor-pointer
                  ${draggedFile === file.id ? 'opacity-50' : ''}
                  ${dragOverFolder === file.id ? 'bg-blue-100' : ''}
                  hover:bg-gray-100 transition-all duration-200
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {renderFileIcon(file)}
                <span className="mt-2 text-sm text-center truncate w-full">
                  {file.name}
                </span>
              </motion.div>
            </ContextMenuTrigger>
            {renderContextMenu(file)}
          </ContextMenu>
        ))}
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
            <th scope="col" className="py-3 pr-3">
              Name
            </th>
            <th scope="col" className="py-3 px-3 text-right">
              Size
            </th>
            <th scope="col" className="py-3 px-3">
              Modified
            </th>
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
                  onDragOver={(e) =>
                    file.type === 'folder'
                      ? handleDragOver(e, file.id)
                      : undefined
                  }
                  onDragLeave={handleDragLeave}
                  onDrop={(e) =>
                    file.type === 'folder' ? handleDrop(e, file.id) : undefined
                  }
                  onClick={() => handleFileClick(file)}
                  className={`
                    group border-b border-gray-100 text-sm cursor-pointer
                    ${draggedFile === file.id ? 'opacity-50' : ''}
                    ${dragOverFolder === file.id ? 'bg-blue-50' : ''}
                    hover:bg-gray-50 transition-colors
                  `}
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}
                >
                  <td className="py-2 pr-3">
                    <div className="flex items-center gap-2">
                      {renderFileIcon(file)}
                      <span className="truncate">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3 text-right text-gray-500">
                    {file.size}
                  </td>
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
              {renderContextMenu(file)}
            </ContextMenu>
          ))}
        </tbody>
      </table>
    </div>
  );
}
