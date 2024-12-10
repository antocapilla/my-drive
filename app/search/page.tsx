"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useDrive } from "../context/drive-context"
import FileList from "../components/file-list"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { File, FileText, ImageIcon, Folder } from 'lucide-react'
import { SearchFilters } from "../components/search-filters"

export default function SearchPage() {
  const [viewMode] = useState<"list" | "grid">("list")
  const [activeTab, setActiveTab] = useState("all")
  const [searchResults, setSearchResults] = useState<ReturnType<typeof useDrive>["getCurrentFiles"]>([])
  const { searchFiles } = useDrive()
  const searchParams = useSearchParams()
  const query = searchParams?.get("q") || ""

  const handleSearch = async (searchQuery: string) => {
    const results = await searchFiles(searchQuery)
    setSearchResults(results)
  }

  useEffect(() => {
    if (query) {
      handleSearch(query)
    }
  }, [query])

  const handleFilterChange = (type: string, value: string) => {
    // Implementar la lógica de filtrado aquí
    console.log('Filter changed:', type, value)
  }

  const filteredResults = searchResults.filter((file) => {
    if (activeTab === "all") return true
    return file.type === activeTab
  })

  const resultStats = {
    all: searchResults.length,
    folder: searchResults.filter((f) => f.type === "folder").length,
    document: searchResults.filter((f) => f.type === "document").length,
    image: searchResults.filter((f) => f.type === "image").length,
  }

  return (
    <ScrollArea className="flex-1">
      <div className="flex flex-col">
        <SearchFilters onFilterChange={handleFilterChange} />
        <div className="mx-auto w-full max-w-5xl px-6 py-8">
          <h1 className="text-2xl font-bold mb-4">Resultados de búsqueda para "{query}"</h1>
          {searchResults.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all" className="gap-2">
                    <File className="h-4 w-4" />
                    Todos
                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {resultStats.all}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="folder" className="gap-2">
                    <Folder className="h-4 w-4" />
                    Carpetas
                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {resultStats.folder}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="document" className="gap-2">
                    <FileText className="h-4 w-4" />
                    Documentos
                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {resultStats.document}
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="image" className="gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Imágenes
                    <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs">
                      {resultStats.image}
                    </span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="mt-0">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FileList viewMode={viewMode} files={filteredResults} />
                  </motion.div>
                </TabsContent>
              </Tabs>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-12 text-center"
            >
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted p-3">
                <File className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-medium">No se encontraron resultados</h3>
              <p className="text-sm text-muted-foreground">
                No hay archivos o carpetas que coincidan con "{query}"
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </ScrollArea>
  )
}

