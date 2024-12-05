'use client';

import { useState } from 'react';
import Sidebar from './components/sidebar';
import Header from './components/header';
import FileList from './components/file-list';
import FilterBar from './components/filter-bar';
import { DriveProvider } from './context/drive-context';

export default function GoogleDrive() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleFilterChange = (newFilters: string[]) => {
    setFilters(newFilters);
    // Apply filters to the file list
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Perform search operation
  };

  return (
    <DriveProvider>
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header viewMode={viewMode} setViewMode={setViewMode} />
          <main className="flex-1 overflow-auto p-4">
            <FilterBar
              onFilterChange={handleFilterChange}
              onSearch={handleSearch}
            />
            <FileList viewMode={viewMode} />
          </main>
        </div>
      </div>
    </DriveProvider>
  );
}
