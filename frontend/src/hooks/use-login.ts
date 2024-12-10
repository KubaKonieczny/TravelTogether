import {useRouter} from "next/navigation";
import {useLoginMutation} from "../../redux/features/authApiSlice";
import {ChangeEvent, FormEvent, useState} from "react";
import {toast} from "react-toastify";

export default function useLogin(){
    const router = useRouter();
    const [login, {isLoading}] = useLoginMutation();
    const [formData, setFormData] = useState({
        email: '',
        password: '',

    });
    const {email, password} = formData;
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value})
    }
    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        login({email, password})
            .unwrap()
            .then(() =>{
                toast.success("User login successfully!")
                router.push('/dashboard');
            })
            .catch(() => {
                toast.error("Something went wrong. Please try again later.");
            })
    }

    return {
        email,
        password,
        isLoading,
        onChange,
        onSubmit
    }
}