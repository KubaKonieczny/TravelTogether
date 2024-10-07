'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Search} from 'lucide-react'

export default function SearchBar() {
    const [isSearchVisible, setIsSearchVisible] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        if (isSearchVisible && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isSearchVisible])

    const handleSearchClick = () => {
        setIsSearchVisible(!isSearchVisible)
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        console.log('Searching for:', searchQuery)
        // Implement your search logic here
    }

    const handleClickOutside = (e: MouseEvent) => {
        if (
            inputRef.current &&
            !inputRef.current.contains(e.target as Node) &&
            buttonRef.current &&
            !buttonRef.current.contains(e.target as Node)
        ) {
            setIsSearchVisible(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    return (
                <form
                    onSubmit={handleSearchSubmit}
                    className="relative right-0 top-0 mt-1 mr-1"
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="relative w-80 pl-10 pr-1 py-2 text-gray-900  rounded-lg shadow-sm focus:outline-none "
                        placeholder="Search..."
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </form>

    )
}