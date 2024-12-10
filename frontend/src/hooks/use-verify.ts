import {useVerifyMutation} from "../../redux/features/authApiSlice";
import {useAppDispatch} from "../../redux/hooks";
import {useEffect} from "react";
import {finishInitialLoad, setAuth} from "../../redux/features/authSlice";

export default function useVerify(){
    const [verify] = useVerifyMutation();
    const dispatch = useAppDispatch();

    useEffect(() => {
        verify(undefined)
            .unwrap()
            .then(()=> {
                dispatch(setAuth())
            })
            .finally(()=>{
                dispatch(finishInitialLoad())
            })
    }, []);



}