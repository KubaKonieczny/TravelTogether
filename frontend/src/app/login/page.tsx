import LoginForm from '@/components/Forms/LoginForm'
import LeftSideImage from "@/components/Forms/LeftSideImage";


export default function Page() {

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left side  */}
            <LeftSideImage />

            {/* Right side */}
            <div className="lg:flex-1 flex items-center justify-center p-8 bg-white ">
                <LoginForm />
            </div>
        </div>

    )
}