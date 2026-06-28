'use client';

import Link from "next/link";
import { useRecipeStore } from "../store/recipe.store";
import { Button } from "@heroui/react";
import RecipeCard from "../components/common/recipe-card";

const App = () => {
  const { recipes, isLoading, error } = useRecipeStore()

  return (
    <>
      <div className="flex w-full justify-center items-center mb-4">
        <Link href="/recipes/new">
          <Button variant="primary">Додати рецепт</Button>
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {isLoading && <p>Завантаження...</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </>
  );
}

export default App;
