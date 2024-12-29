'use client'

import { useRef, useState, useEffect } from 'react'
import ReusableTripStepCard from "@/components/utils/ReusableTripStepCard"

export default function TripList() {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(true)

    const handleAttachmentClick = () => {
        alert('Attachment clicked')
    }

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const container = scrollRef.current
            const scrollAmount = container.clientWidth
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

    useEffect(() => {
        checkScrollButtons()
        window.addEventListener('resize', checkScrollButtons)
        return () => window.removeEventListener('resize', checkScrollButtons)
    }, [])

    return (
        <div className="w-full">
            <div className="w-full h-px bg-gray-200 mb-4" /> {/* Divider */}
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-hidden pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={checkScrollButtons}
                >
                    <div className="flex-none w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] snap-start">
                        <ReusableTripStepCard
                            title="Summer Vacation"
                            description="A week-long trip to the beautiful beaches of Hawaii. Enjoy the sun, surf, and local cuisine."
                            date="2023-07-15"
                            time="09:00 AM"
                            location={{ from: "New York", to: "Honolulu" }}
                            price="$1,500"
                            duration="7 days"
                            distance="4,983 miles"
                            onAttachmentClick={handleAttachmentClick}
                        />
                    </div>
                    <div className="flex-none w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] snap-start">
                        <ReusableTripStepCard
                            title="Business Conference"
                            description="Annual tech conference in San Francisco. Network with industry leaders and learn about the latest innovations."
                            date="2023-09-22"
                            time="08:30 AM"
                            location="Moscone Center, San Francisco"
                            price="$800"
                            duration="3 days"
                            distance="2,902 miles"
                            onAttachmentClick={handleAttachmentClick}
                        />
                    </div>
                    <div className="flex-none w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] snap-start">
                        <ReusableTripStepCard
                            title="European Adventure"
                            description="A two-week journey through Europe's most iconic cities. Experience rich history and diverse cultures."
                            date="2023-10-01"
                            time="11:00 AM"
                            location={{ from: "London", to: "Rome" }}
                            price="$3,000"
                            duration="14 days"
                            distance="8,500 miles"
                            onAttachmentClick={handleAttachmentClick}
                        />
                    </div>
                    <div className="flex-none w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.75rem)] snap-start">
                        <ReusableTripStepCard
                            title="Ski Trip"
                            description="Hit the slopes in the Swiss Alps. Perfect for winter sports enthusiasts and beginners alike."
                            date="2024-01-15"
                            time="08:00 AM"
                            location="Zermatt, Switzerland"
                            price="$2,200"
                            duration="5 days"
                            distance="4,200 miles"
                            onAttachmentClick={handleAttachmentClick}
                        />
                    </div>
                </div>
                {showLeftButton && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-md z-10"
                        aria-label="Scroll left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                {showRightButton && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 p-2 rounded-full shadow-md z-10"
                        aria-label="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    )
}