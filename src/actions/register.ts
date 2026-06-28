'use server'

import { IFormData } from "../types/form-data";
import { saltAndHashPassword } from "../utils/password";
import prisma from "../utils/prisma";

export async function registerUser(formData: IFormData) {
    const {email, password, confirmPassword} = formData

    if (password !== confirmPassword) {
        return { error: 'Паролі не співпадають'}
    }

    if (password.length < 6) {
        return {error: 'Пароль повинен бути не меньше 6 символів'}
    }

    try {

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return {error: 'Користувач з таким email вже існує!'}
        }

        const pwHash = await saltAndHashPassword(password)

        const user= await prisma.user.create({
            data: {
                email: formData.email,
                password: pwHash
            }
        })

        return { success: true, user: { id: user.id, email: user.email } };
    } catch (error) {
        console.error('Помилка реєстрації:', error)
        return { error: 'Помилка при реєстрації' }
    }

}
