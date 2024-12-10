"use client"

import { X, Share2, Download, Trash2, MoreVertical } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

interface SelectionToolbarProps {
  selectedCount: number
  onClose: () => void
  onShare: () => void
  onDownload: () => void
  onDelete: () => void
}

export function SelectionToolbar({
  selectedCount,
  onClose,
  onShare,
  onDownload,
  onDelete
}: SelectionToolbarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute top-0 left-0 right-0 z-50 flex h-16 items-center gap-2 bg-background px-6 shadow-sm"
    >
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
      <span className="text-sm text-muted-foreground">
        {selectedCount} seleccionados
      </span>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onShare}>
          <Share2 className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDownload}>
          <Download className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onDelete}>
          <Trash2 className="h-5 w-5" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Mover a</DropdownMenuItem>
            <DropdownMenuItem>Agregar a destacados</DropdownMenuItem>
            <DropdownMenuItem>Cambiar nombre</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  )
}

