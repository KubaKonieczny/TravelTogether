import Image from 'next/image'
import { Flag} from 'lucide-react'
import {  FaRoad } from "react-icons/fa"

import {useRouter} from "next/navigation"

interface ReusableCardProps {
    title: string;
    id: string;
    type: string;
    description: string;
    picture: string;
    start_date: string;
    end_date: string;
}

const ReusableCard: React.FC<ReusableCardProps> = ({
                                                       title,
                                                       id,
                                                       type,
                                                       description,
                                                       picture,
                                                       start_date,
                                                       end_date,
                                                   }) => {

    const router = useRouter()

    const handleClick = () => {
        router.push(`/${type}/${id}`)
    }

    return (
        <div onClick={handleClick}
            className="w-full h-64 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
            <div className="flex h-full">
                <div className="flex flex-col p-4 w-2/3">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-base font-semibold text-gray-800 line-clamp-2 flex-1 mr-2">{title}</h3>
                        <div className="text-right flex-shrink-0">
                            {start_date && (<div className="flex items-center text-sm text-gray-600">
                                <FaRoad className="w-4 h-4 mr-1" />
                                <span>{start_date}</span>
                            </div>)}
                            {end_date &&<div className="flex items-center text-sm text-gray-600">
                                <Flag className="w-4 h-4 mr-1" />
                                <span>{end_date}</span>
                            </div>}
                        </div>
                    </div>
                    <div className="h-px bg-gray-200 mb-2" />
                    <p className="text-sm text-gray-600 line-clamp-6">{description}</p>
                </div>
                <div className="w-1/3 relative">
                    <Image
                        src={picture || '/images/group_profile.png'}
                        alt={title}
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>
        </div>
    )
}

export default ReusableCard
