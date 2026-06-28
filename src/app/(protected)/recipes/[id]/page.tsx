'use client';

import RecipeForm from "@/src/forms/recipe.form";
import { useRecipeStore } from "@/src/store/recipe.store";
import { useParams } from "next/navigation";

const EditRecipePage = () => {
    const {id} = useParams<{id: string}>();
    const { recipes, isLoading, error } = useRecipeStore();
    const recipe = recipes.find((r) => r.id === id) ?? null;
    const hasSearched = recipes.length > 0 || Boolean(error);

    if (isLoading) return <p className="text-center">Завантаження...</p>;
    if (error) return <p className="text-red-500 text-center">{error}</p>

    if (hasSearched && !recipe) {
        return <p className="text-red-500 text-center">Рецепт не знайдено</p>
    }

    if (recipe) {
        return (
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">
                    Редагувати рецепт: {recipe.name}
                </h1>
                <RecipeForm initialRecipe={recipe} />
            </div>
        )
    }

    return <p className="text-center">Завантаження...</p>

}

export default EditRecipePage;
