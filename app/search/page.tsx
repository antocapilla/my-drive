'use client';

import { useState, useEffect } from 'react';
import { useDrive } from '../context/drive-context';
import FileList from '../components/file-list';
import FilterBar from '../components/filter-bar';

export default function SearchPage() {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [filters, setFilters] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const { searchFiles } = useDrive();

  const handleFilterChange = (newFilters: string[]) => {
    setFilters(newFilters);
    // Apply filters to the search results
  };

  const handleSearch = async (query: string) => {
    const results = await searchFiles(query);
    setSearchResults(results);
  };

  useEffect(() => {
    // Perform initial search or load suggested files/folders
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Drive</h1>
      <FilterBar onFilterChange={handleFilterChange} onSearch={handleSearch} />
      <div className="mt-4">
        <h2 className="text-lg font-semibold mb-2">Search Results</h2>
        <FileList viewMode={viewMode} files={searchResults} />
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Suggested</h2>
        {/* Add a component to display suggested files and folders */}
      </div>
    </div>
  );
}
