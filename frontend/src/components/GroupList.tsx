import { useRef, useState, useEffect } from 'react'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import ReusableCard from "@/components/utils/ReusableCard";
import getGroupsData from "@/hooks/getGroups";

interface GroupListProps {
   action: () => Promise<any>;
   type: string;
}

export default function GroupList({action, type}: GroupListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(true)

    const groups = action.groupsData

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const container = scrollRef.current
            const scrollAmount = container.clientWidth * 0.8
            const newScrollPosition = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount

            container.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            })
        }
    }

    const checkScrollButtons = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setShowLeftButton(scrollLeft > 0)
            setShowRightButton(scrollLeft < scrollWidth - clientWidth)
        }
    }

    // useEffect(() => {
    //
    //     checkScrollButtons()
    //     window.addEventListener('resize', checkScrollButtons)
    //     return () => window.removeEventListener('resize', checkScrollButtons)
    // }, [])

    return (
        <div className="w-full">
            <div className="w-full h-px bg-gray-200 mb-4" />
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={checkScrollButtons}
                >

                    {groups && (groups.map((group, index) => (

                        <div key={index} className="flex-none snap-start w-[calc(100%-2rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(40%-1rem)]">
                            <ReusableCard
                                title={group.name}
                                description={group.description}
                                start_date={group.start_date}
                                end_date={group.end_date}
                                picture={type === 'group'? group.group_picture: group.trip_picture}
                                id={group.id}
                                type={type}
                            />
                        </div>
                    )))}
                </div>
                {showLeftButton && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-300 bg-opacity-50 p-2 rounded-full shadow-md"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                )}
                {showRightButton && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-300 bg-opacity-50 p-2 rounded-full shadow-md"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    )
}

