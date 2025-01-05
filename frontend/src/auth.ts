import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import "next-auth";
import 'next-auth/jwt'
import {authConfig} from "@/auth.config";
import * as cookie_parser from 'cookie'
import Facebook  from "@auth/core/providers/facebook";
import Google from "@auth/core/providers/google";
import {cookies} from "next/headers";



export const { handlers, signIn, signOut, auth } = NextAuth({ ...authConfig,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: {label: "email", type: "email"},
                password: {label: "password", type: "password"}
            },
            async authorize(credentials,) {
                try {

                const response = await axios({
                    url: process.env.NEXTAUTH_BACKEND_URL + "auth/login/",
                    method: "post",
                    data: credentials,
                })

                    const data = response.data;
                    const cookieStore = await cookies();

                    // Handle cookies from Django backend
                    const setCookies = response.headers['set-cookie'];
                    if (setCookies) {
                        for (const cookieStr of setCookies) {
                            const parsedCookie = cookie_parser.parse(cookieStr);
                            const [cookieName, cookieValue] = Object.entries(parsedCookie)[0];

                             await cookieStore.set({
                                name: cookieName,
                                value: cookieValue,
                                httpOnly: true,
                                secure: true,
                                sameSite: 'none',
                                path: parsedCookie.Path || '/',
                                maxAge: parseInt(parsedCookie["Max-Age"] || '0'),
                                expires: parsedCookie.expires ? new Date(parsedCookie.expires) : undefined,
                            });
                        }
                    }

                    if (!data) {
                        throw new Error('No data received from login endpoint');
                    }


                    if (data) return {
                        first_name: data.user.first_name,
                        last_name: data.user.last_name,
                        email: data.user.email,
                        description: data.user.description,
                        profile_picture: data.user.profile_picture,

                        accessToken: data.access,
                        refreshToken: data.refresh};
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        // Handle specific error messages from your backend
                        const errorMessage = error.response?.data?.detail || "Invalid credentials";
                        throw new Error(errorMessage);
                    }
                    throw new Error("An error occurred during authentication");
                }
                return null;
            },


        }),
        Google,
        Facebook,

    ],


    callbacks: {
        async session({ session, token }) {
            // Include user data in the session
            if (token && session.user) {
                session.user = {
                    ...session.user,
                    ...token.user
                }
            }
            return session
        },
        async jwt({ token, user, trigger, session }) {
            // Initial sign in
            if (user) {
                token.user = user
            }

            if (trigger === "update" && session) {
                token.user = {
                    ...token.user,
                    ...session.user
                }
            }

            return token
        }
    },



    pages: {
        signIn: "/login",
    }
})
