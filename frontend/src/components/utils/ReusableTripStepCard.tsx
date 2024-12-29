import { Paperclip } from 'lucide-react'

interface ReusableTripStepCardProps {
    title: string
    description: string
    date: string
    time: string
    location: string | { from: string; to: string }
    price: string
    duration: string
    distance: string
    onAttachmentClick: () => void
}

const ReusableTripStepCard: React.FC<ReusableTripStepCardProps> = ({
                                                       title,
                                                       description,
                                                       date,
                                                       time,
                                                       location,
                                                       price,
                                                       duration,
                                                       distance,
                                                       onAttachmentClick,
                                                   }) => {
    return (
        <div className="flex w-full max-w-2xl aspect-[7/3] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
            <div className="flex flex-col flex-grow p-4 w-2/3">
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <div className="h-px bg-gray-200 mb-2" />
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
                <div className="flex justify-between items-center text-xs mt-4 pt-2 ">
                    <div>
                        <span className="font-medium">{price}</span>
                    </div>
                    <div>
                        <span className="font-medium">{duration}</span>
                    </div>
                    <div>
                        <span className="font-medium">{distance}</span>
                    </div>
                    <div>
                        <button
                            onClick={onAttachmentClick}
                            className="text-gray-600 hover:text-gray-800 focus:outline-none"
                            aria-label="Attachments"
                        >
                            <Paperclip size={18} />
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-1/3 border-l border-gray-200 p-4 flex flex-col justify-center items-center bg-gray-50">
                <p className="text-sm font-medium text-gray-800">{date}</p>
                <p className="text-sm text-gray-600">{time}</p>
                {typeof location === 'string' ? (
                    <p className="text-sm text-gray-600 text-center mt-2">{location}</p>
                ) : (
                    <div className="text-sm text-gray-600 text-center mt-2">
                        <p>{location.from}</p>
                        <p>↓</p>
                        <p>{location.to}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ReusableTripStepCard

