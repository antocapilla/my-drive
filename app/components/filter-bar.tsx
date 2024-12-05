'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type FilterBarProps = {
  onFilterChange: (filters: string[]) => void;
  onSearch: (query: string) => void;
};

export default function FilterBar({
  onFilterChange,
  onSearch,
}: FilterBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
    onFilterChange(selectedFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <div className="flex items-center space-x-4 mb-4">
      <form onSubmit={handleSearch} className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search in Drive"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </form>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>File Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={selectedFilters.includes('folder')}
            onCheckedChange={() => handleFilterChange('folder')}
          >
            Folders
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedFilters.includes('document')}
            onCheckedChange={() => handleFilterChange('document')}
          >
            Documents
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={selectedFilters.includes('image')}
            onCheckedChange={() => handleFilterChange('image')}
          >
            Images
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
