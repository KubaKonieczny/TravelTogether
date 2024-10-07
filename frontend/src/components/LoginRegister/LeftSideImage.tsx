import Image from "next/image";
import TypewriterEffect from "@/components/LoginRegister/TypewriterEffect";


export default function LeftSideImage() {


    return (
        <div className="lg:flex-1 relative h-64 lg:h-auto">
            <Image
                src="/palms.jpg"
                alt="Serene landscape"
                fill
                objectFit="cover"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-75"></div>
            <div className="absolute inset-0 flex items-center justify-center">
                <TypewriterEffect/>
            </div>
        </div>
    )
}