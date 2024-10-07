
import RegisterForm from '@/components/LoginRegister/RegisterForm'
import LeftSideImage from "@/components/LoginRegister/LeftSideImage";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left side with image and typewriter effect */}
            <LeftSideImage />

            {/* Right side with login form */}
            <div className="lg:flex-1 flex items-center justify-center p-8 bg-white">
                <RegisterForm />
            </div>
        </div>
    )
}