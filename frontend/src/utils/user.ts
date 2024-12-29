"use server"
import { redirect } from "next/navigation";
import { CredentialsSignin } from "next-auth";
import {signIn, signOut} from "@/auth";
import {router} from "next/client";
import {SignInResponse} from "next-auth/react";
import axios from "axios";

export const login = async (formData: FormData) => {

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard"
        })

        if (result?.error) {
            return {
                error: result.error,
                status: 401
            };
        }

    } catch (error) {
        return {
            error: "An unexpected error occurred",
            status: 500
        };
    }


};


export const register = async (formData: FormData) => {

    const email = formData.get("email") as string;
    const first_name = formData.get("first_name") as string;
    const last_name = formData.get("last_name") as string;
    const password1 = formData.get("password1") as string;
    const password2 = formData.get("password2") as string;
    const password = formData.get("password1") as string;

    const data =  {
        email:email,
        first_name:first_name,
        last_name:last_name,
        password1:password1,
        password2:password2
    }

    try{
        const response = await axios({
                url: process.env.NEXTAUTH_BACKEND_URL + "auth/register/",
                method: "post",
                data: data
            }
        ).then((response) => {
            console.log(response);
        });
    }catch (error){
        throw error;
    }


    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirectTo: "/dashboard"
        })

    } catch (error) {
        // const someError = error as CredentialsSignin;
        // return someError.cause;
        throw error;
    }


};

export async function logout() {
    const response = await axios({
            url: process.env.NEXTAUTH_BACKEND_URL + "auth/logout/",
            method: "post",
        }
    ).then((response) => {
        console.log(response.data);
    });
    try{
        await signOut();
    }
    catch(error){
        console.log(error)
    }
}


export async function doSocialLogin() {
    try{
        await signIn('google');
    }

    catch (error) {
        // const someError = error as CredentialsSignin;
        // return someError.cause;
        throw error;
    }



}

export const handleSocialLogin = async (provider: 'Facebook' | 'Google') => {
    // Implement social login logic here
    console.log(`Logging in with ${provider}`)
}