import { create } from "zustand";
import { IIngredient } from "../types/ingredient";
import { createIngredient, deleteIngredients, getIngredients } from "../actions/ingredients";

interface IngredientsState {
    ingredients: IIngredient[];
    isLoading: boolean;
    error: string | null;
    loadIngridients: () => Promise<void>;
    addIngredient: (formData: FormData) => Promise<void>;
    removeIngredient: (id: string) => Promise<void>
}

export const useIngredientStore = create<IngredientsState>((set) => ({
    ingredients: [], 
    isLoading: false,
    error: null,
    loadIngridients: async () => {
        set({ isLoading: true, error: null})
        try {
            const result = await getIngredients()

            if (result.success) {
                set({ingredients: result.ingredients, isLoading: false})
            } else {
                set({ error: result.error, isLoading: false })
            }
        } catch (error) {
            console.log('error', error);
            set({ error: 'Помилка під час завантаження інгрендієнтів', isLoading: false})
        }
    },
    addIngredient: async (formData: FormData) => {
        set({ isLoading: true, error: null})

        try {
            const result = await createIngredient(formData)

            if (result.success) {
                set((state) => ({
                    ingredients: [...state.ingredients, result.ingredient],
                    isLoading: false
                }))
            } else {
                set({error: result.error, isLoading: false})
            }
        } catch (error) {
            console.log('error', error)
            set({error: 'Помилка під час додавання інгредієнту', isLoading: false})
        }
    },
    removeIngredient: async (id: string) => {
            set({isLoading: true, error: null})

            try {
                const result = await deleteIngredients(id)

                if (result.success) {
                    set((state) => ({
                        ingredients: state.ingredients.filter(
                            (ingredient) => ingredient.id !== id
                        ),
                        isLoading: false
                    }))
                } else {
                    set({ error: result.error, isLoading: false})
                }
            } catch (error) {
                console.log('error', error)
                set({ error: 'Помилка під час видалення інгрендієнту', isLoading: false})
            }
        }
}))