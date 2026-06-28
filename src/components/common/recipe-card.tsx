'use client';

import { UNIT_ABBREVIATIONS } from "@/src/constants/select-options";
import { useAuthStore } from "@/src/store/auth.store";
import { useRecipeStore } from "@/src/store/recipe.store";
import Image from "next/image";
import { IRecipe } from "@/src/types/recipe";
import { Button, Card, CardContent, CardHeader, Link } from "@heroui/react";
import { useTransition } from "react";

interface RecipeCardProps {
    recipe: IRecipe
}

const RecipeCard = ({ recipe }: RecipeCardProps) => {
    const { removeRecipe } = useRecipeStore();
    const { isAuth } = useAuthStore();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await removeRecipe(recipe.id)
            } catch (error) {
                console.error('Помилка під час видалення рецепту: ', error)
            }
        })
    }

    const getUnitLabel = (unit: string) => {
        const unitOption = UNIT_ABBREVIATIONS.find(
            (option) => option.value === unit
        )
        return unitOption ? unitOption.label : unit.toLowerCase();
    }

    return (
        <Card className="w-full min-w-[254px] max-w-md h-[480px] flex flex-col">
            <div className="h-48 overflow-hidden">
                {recipe.imageUrl ? (
                    <div className="relative h-48 group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg">
                        <Image
                            src={recipe.imageUrl}
                            alt='Image for recipe'
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Фото відсутнє</span>
                    </div>
                )}
            </div>

            <CardHeader className="flex justify-between items-center text-black">
                <h2 className="text-xl font-bold">{recipe.name}</h2>
            </CardHeader>
            
            <CardContent className="flex-1 text-black">
                <p className="text-gray-600 line-clamp-6">
                    {recipe.description || 'Без опису'}
                </p>
                <h3 className="mt-4 font-semibold">Інгрендієнти:</h3>
                <ul className="list-disc pl-5 overflow-y-auto max-h-24">
                    {recipe.ingredients.map((ing) => (
                        <li key={ing.id}>
                            {ing.ingredient.name}: {ing.quantity}{' '}
                            {getUnitLabel(ing.ingredient.unit)}
                        </li>
                    ))}
                </ul>
            </CardContent>

            {isAuth && (
                <div className="flex justify-end gap-2 p-4">
                    <Link href={`recipes/${recipe.id}`}>
                        <Button variant="primary">
                            Редагувати
                        </Button>
                    </Link>
                    <Button
                        variant="danger-soft"
                        onPress={handleDelete}
                        isPending={isPending}>
                        Видалити
                    </Button>
                </div>
            )}
        </Card>
    )
}

export default RecipeCard;