
import LoginForm from '@/components/LoginRegister/LoginForm'
import LeftSideImage from "@/components/LoginRegister/LeftSideImage";

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