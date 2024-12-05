'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Grid, List, Search, Settings, Plus, Folder } from 'lucide-react';
import { useDrive } from '../context/drive-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Breadcrumb from './breadcrumb';
import FileUpload from './file-upload';

interface HeaderProps {
  viewMode: 'list' | 'grid';
  setViewMode: (mode: 'list' | 'grid') => void;
}

export default function Header({ viewMode, setViewMode }: HeaderProps) {
  const { currentFolder, addFolder, searchFiles } = useDrive();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchFiles(searchQuery);
  };

  return (
    <header className="border-b px-6 py-3">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">{currentFolder}</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid
              size={18}
              className={viewMode === 'grid' ? 'text-primary' : ''}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List
              size={18}
              className={viewMode === 'list' ? 'text-primary' : ''}
            />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings size={18} />
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Breadcrumb />
        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <Input
            type="search"
            placeholder="Search in Drive"
            className="w-full md:w-[300px] bg-muted"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" variant="ghost" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </div>
      <div className="mt-4">
        <FileUpload />
      </div>
    </header>
  );
}
