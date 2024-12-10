"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

interface SearchFiltersProps {
  onFilterChange: (type: string, value: string) => void
}

export function SearchFilters({ onFilterChange }: SearchFiltersProps) {
  const [type, setType] = React.useState("todos")
  const [modified, setModified] = React.useState("cualquier-fecha")

  return (
    <div className="flex items-center gap-2 px-6 py-2 border-b">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Tipo
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={type} onValueChange={setType}>
            <DropdownMenuRadioItem value="todos">Todos</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="carpetas">Carpetas</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="documentos">Documentos</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="imagenes">Imágenes</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Modificado
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value={modified} onValueChange={setModified}>
            <DropdownMenuRadioItem value="cualquier-fecha">Cualquier fecha</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="hoy">Hoy</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ayer">Ayer</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ultima-semana">Última semana</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="ultimo-mes">Último mes</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button variant="outline" size="sm">
        Solo título
      </Button>
    </div>
  )
}

