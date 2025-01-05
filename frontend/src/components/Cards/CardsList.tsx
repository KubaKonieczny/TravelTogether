import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Card from "@/components/Cards/Card";


interface GroupListProps {
   action?: () => Promise<any>;
   type: string;
   label: string;
   data?: Object;
}

export default function CardsList({action, type, label, data}: GroupListProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showLeftButton, setShowLeftButton] = useState(false)
    const [showRightButton, setShowRightButton] = useState(false)

    console.log(data)

    const groups = !data ? action.data : data

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const container = scrollRef.current
            const scrollAmount = container.clientWidth
            container.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            })
        }
    }

    const updateButtonVisibility = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setShowLeftButton(scrollLeft > 0)
            setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1) // Add tolerance for precision
        }
    }

    useEffect(() => {
        updateButtonVisibility() // Initial check

        const container = scrollRef.current
        container?.addEventListener('scroll', updateButtonVisibility)
        window.addEventListener('resize', updateButtonVisibility)

        return () => {
            container?.removeEventListener('scroll', updateButtonVisibility)
            window.removeEventListener('resize', updateButtonVisibility)
        }
    }, [groups])

    return (
        <div className="w-full">
            <div className="w-full h-px bg-gray-200 mb-4" />
            <div className="relative">
                <div
                    ref={scrollRef}
                    className="flex space-x-4 overflow-x-auto pb-4 snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {groups?.length ? (
                        groups.map((group, index) => (
                            <div
                                key={index}
                                className="flex-none snap-start w-[calc(100%-2rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(40%-1rem)]"
                            >
                                <Card
                                    title={group.name}
                                    description={group.description}
                                    start_date={group.start_date}
                                    end_date={group.end_date}
                                    picture={type === 'group' ? group.group_picture : group.trip_picture}
                                    id={group.id}
                                    type={type}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-6 bg-white shadow-lg rounded-lg items-center">
                            <h1 className="text-lg font-semibold text-gray-800">
                                You don't have any {label}
                            </h1>
                        </div>
                    )}
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
