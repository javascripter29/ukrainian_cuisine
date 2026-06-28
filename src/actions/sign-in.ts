'use server'

import { signIn } from "../auth/auth";
import { AuthError } from "next-auth";

export async function sigInWithCredentials(email: string, password: string) {
    try {
        await signIn('credentials', {
            email,
            password,
            redirect: false
        })

        return { success: true };
    } catch (error) {
        if (error instanceof AuthError) {
            return {
                error: "Невірний email або пароль",
            };
        }

        console.error("Помилка авторизації: ", error)
        return {
            error: "Не вдалося увійти. Спробуйте ще раз",
        };
    }
}
