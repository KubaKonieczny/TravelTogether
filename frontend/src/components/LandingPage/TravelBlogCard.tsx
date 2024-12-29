import React from 'react';
import Image from "next/image";
interface TravelBlogCardProps {
    imageFirst?: boolean;
    imageUrl: string;
    title: string;
    description: string;
}

const TravelBlogCard: React.FC<TravelBlogCardProps> = ({ imageFirst, imageUrl, title, description }) => {
    return (
        <div
            className={` container mx-auto flex  flex-col ${imageFirst ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
            {/* Image Section */}
            <div className="flex-shrink-0 w-full md:w-1/2 p-4">
                <Image
                    className="w-full h-auto object-cover rounded-lg shadow-lg"
                    src={imageUrl}
                    alt={imageUrl}
                    width={500}
                    height={300}
                    priority={true}
                />
            </div>

            {/* Text Section */}
            <div className="flex flex-col justify-center items-start p-4 md:p-8 w-full md:w-1/2 bg-gray-50">
                {/*<h3 className="text-purple-600 font-bold uppercase tracking-wide text-lg md:text-xl">*/}
                {/*    Wander the World*/}
                {/*</h3>*/}
                <h2 className="mt-2 text-2xl md:text-3xl font-bold text-purple-600">
                    {title}
                </h2>
                <p className="mt-4 text-base md:text-lg text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default TravelBlogCard;