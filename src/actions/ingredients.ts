"use server";

import { success, ZodError } from "zod";
import { ingredientSchema } from "../schema/zod";
import prisma from "../utils/prisma";

export async function createIngredient(formData: FormData) {
    try {
        const pricePerUnit = formData.get("pricePerUnit") as string | null;

        const data = {
            name: formData.get("name") as string,
            category: (formData.get("category") as string).toUpperCase(),
            unit: (formData.get("unit") as string).toUpperCase(),
            pricePerUnit: pricePerUnit ? parseFloat(pricePerUnit) : null,
            description: (formData.get("description") as string) || undefined,
        };

        const validatedData = ingredientSchema.parse(data);

        const ingredient = await prisma.ingredient.create({
            data: {
                name: validatedData.name,
                category: validatedData.category,
                unit: validatedData.unit,
                pricePerUnit: validatedData.pricePerUnit,
                description: validatedData.description,
            },
        });

        return { success: true, ingredient };
    } catch (error) {
        console.error("Помилка створення інгредієнту: ", error);
        return { error: "Помилка створення інгредієнту" };
    }
}

export async function getIngredients() {
    try {
        const ingredients = await prisma.ingredient.findMany();

        return { success: true, ingredients}
    } catch (error) {
        console.error('Помилка отримання  інгредієнтів: ', error)
        return { error: 'Помилка отримання  інгредієнтів'}
    }
}

export async function deleteIngredients(id: string) {
    try {
        const ingredient = await prisma.ingredient.delete({
            where: { id }
        });
        
        return { success: true, ingredient }
    } catch (error) {
        console.error('Помилка видалення інгрендієнту: ', error)
        return {error: 'Помилка видалення інгрендієнту'}
    }
}
