"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, File, FileText, ImageIcon, Folder, Clock, X, ArrowRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDrive } from "../context/drive-context"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface SearchBarProps {
  onSearch: (query: string) => void
  className?: string
}

export function SearchBar({ onSearch, className }: SearchBarProps) {
  const [query, setQuery] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [recentSearches] = React.useState([
    "presupuesto 2024",
    "fotos vacaciones",
    "documentos importantes",
  ])
  const { searchFiles } = useDrive()
  const [results, setResults] = React.useState<any[]>([])
  const searchRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = React.useCallback(
    async (searchQuery: string) => {
      setQuery(searchQuery)
      if (searchQuery.trim()) {
        const searchResults = await searchFiles(searchQuery)
        setResults(searchResults.slice(0, 5)) // Solo mostrar 5 resultados en el dropdown
      } else {
        setResults([])
      }
    },
    [searchFiles]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      onSearch(query)
      setIsFocused(false)
    }
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="h-4 w-4 text-blue-500" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-green-500" />
      case "document":
        return <FileText className="h-4 w-4 text-orange-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const resultStats = {
    total: results.length,
    folders: results.filter(f => f.type === 'folder').length,
    documents: results.filter(f => f.type === 'document').length,
    images: results.filter(f => f.type === 'image').length,
  }

  return (
    <div className={cn("relative w-full", className)} ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar en Drive"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="h-12 w-full rounded-lg border bg-muted/50 pl-9 pr-12 text-sm focus:bg-background focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full hover:bg-gray-100"
            onClick={() => {
              setQuery("")
              setResults([])
              inputRef.current?.focus()
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <AnimatePresence>
        {isFocused && (query || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-14 w-full rounded-lg border bg-background shadow-lg"
          >
            <ScrollArea className="h-full max-h-[80vh]">
              {!query && (
                <div className="p-2">
                  <div className="mb-2 px-2 text-sm font-medium text-muted-foreground">
                    Búsquedas recientes
                  </div>
                  {recentSearches.map((search, index) => (
                    <motion.button
                      key={search}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                      onClick={() => handleSearch(search)}
                    >
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {search}
                    </motion.button>
                  ))}
                </div>
              )}
              {query && results.length > 0 && (
                <div className="p-2">
                  <div className="mb-2 px-2 text-sm font-medium text-muted-foreground">
                    Resultados sugeridos
                  </div>
                  {results.map((result, index) => (
                    <motion.button
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                      onClick={() => {
                        router.push(`/folders/${result.id}`)
                        setIsFocused(false)
                      }}
                    >
                      {getFileIcon(result.type)}
                      <div className="flex flex-1 flex-col items-start">
                        <span className="font-medium">{result.name}</span>
                        <span className="text-xs text-muted-foreground">
                          Modificado {result.modified}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                  {results.length > 5 && (
                    <Button
                      variant="ghost"
                      className="w-full justify-between px-2 py-1.5 text-sm font-medium text-blue-600 hover:bg-muted"
                      onClick={() => {
                        onSearch(query)
                        setIsFocused(false)
                      }}
                    >
                      Ver todos los resultados
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              {query && results.length === 0 && (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No se encontraron resultados para "{query}"
                </div>
              )}
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

