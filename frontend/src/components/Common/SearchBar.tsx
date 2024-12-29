import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';




const SearchBar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
        // Implement your search logic here
    };

    return (
        <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white rounded-lg shadow-sm focus:outline-none"
                    placeholder="Search..."
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
        </form>
    );
};

export default SearchBar;
