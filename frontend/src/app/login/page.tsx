
import LoginForm from '@/components/Forms/LoginForm'
import LeftSideImage from "@/components/Forms/LeftSideImage";
import {useSession} from "next-auth/react";

export default function Page() {

    // const { data: session } = useSession();
    // console.log("session", session)
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