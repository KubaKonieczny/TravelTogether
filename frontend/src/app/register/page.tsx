import RegisterForm from '@/components/Forms/RegisterForm'
import LeftSideImage from "@/components/Forms/LeftSideImage";


export default function Page() {
    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            <LeftSideImage />

            <div className="lg:flex-1 flex items-center justify-center p-8 bg-white">
                <RegisterForm />
            </div>
        </div>
    )
}