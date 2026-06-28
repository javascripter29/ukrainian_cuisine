'use client';

import { useState, useTransition } from "react";
import { IRecipe } from "../types/recipe";
import { useIngredientStore } from "../store/ingredient.store";
import { useRecipeStore } from "../store/recipe.store";
import { useRouter } from "next/navigation";
import { FieldError, Form, Input, TextField, Select, ListBox, Button } from "@heroui/react";

interface RecipeFormProps {
    initialRecipe?: IRecipe
}

interface IIngredientField {
    id: number;
    ingredientId : string;
    quantity: number | null;
}

const initialState = {
    name: '',
    description: '',
    imageUrl: ''
}

const RecipeForm = ({ initialRecipe }: RecipeFormProps ) => {
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: initialRecipe?.name || initialState.name,
        description: initialRecipe?.description || initialState.description,
        imageUrl: initialRecipe?.imageUrl || initialState.imageUrl
    })

    const [ingredientFields, setIngredientFields] = useState<IIngredientField[]>(
        initialRecipe?.ingredients
            ? initialRecipe.ingredients.map((ing, index) => ({
                id: index,
                ingredientId: ing.ingredientId,
                quantity: ing.quantity
            }))
            : [{id: 0, ingredientId: '', quantity: null}]
    )

    const {ingredients} = useIngredientStore()
    const { addRecipe, updateRecipe } = useRecipeStore()
    const [isPending, startTransitiion] = useTransition()

    const router = useRouter();

    const handleAddIngredientField = () => {
        if (ingredientFields.length < 10) {
            setIngredientFields([
                ...ingredientFields,
                { id: ingredientFields.length, ingredientId: '', quantity: null}
            ])
        }
    }

    const handleRemoveIngredientField = (id: number) => {
        if (ingredientFields.length > 1) {
            setIngredientFields(ingredientFields.filter((field) => field.id !== id))
        }
    }

    const handleIngredientChange = (
        id: number,
        field: keyof IIngredientField,
        value: string | number | null
    ) => {
        setIngredientFields(
            ingredientFields.map((f) => (f.id === id ? {...f, [field]: value} : f))
        )
    }

    const handleSubmit = async (formData: FormData) => {
        startTransitiion(async () => {
            setError(null);

            const result = initialRecipe
                ? await updateRecipe(initialRecipe.id, formData)
                : await addRecipe(formData);
            
            if (result.success) {
                setIngredientFields([{ id: 0, ingredientId: '', quantity: null}])
                router.push('/');
                setFormData(initialState);
            } else {
                setError(result.error || 'Помилка під час зберігання інгрендієнту')
            }
        })
    }

    return (
        <Form className="flex w-full max-w-[560px] flex-col gap-4" action={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <TextField
                isRequired
                name="name"
                type="text"
                value={formData.name}
                className='w-full bg-default-100 text-sm focus:outline-none'
                validate={(value) => (!value ? 'Назва обовязкова!' : null)}
            >
                <Input
                    placeholder="Введіть назву рецепту"
                    className='w-full bg-default-100 text-sm focus:outline-none'
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
                <FieldError />
            </TextField>

            <TextField
                name="description"
                type="text"
                value={formData.description}
                className='w-full bg-default-100 text-sm focus:outline-none'
            >
                <Input
                    placeholder="Введіть опис (необов'язково)"
                    className='w-full bg-default-100 text-sm focus:outline-none'
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
                <FieldError />
            </TextField>

            <TextField
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                className='w-full bg-default-100 text-sm focus:outline-none'
            >
                <Input
                    placeholder="URL зображення (необов'язково)"
                    className='w-full bg-default-100 text-sm focus:outline-none'
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                />
                <FieldError />
            </TextField>

            <div className="flex w-full flex-col gap-3 pt-1">
                {ingredientFields.map((field, index) => (
                    <div key={field.id} className="grid w-full grid-cols-[minmax(0,1fr)_128px_44px] items-start gap-3">
                        <Select
                            isRequired
                            name={`ingredient_${index}`}
                            placeholder="Оберіть інгрендієнт"
                            selectedKey={field.ingredientId || null}
                            className='w-full truncate bg-default-100 text-sm text-black'
                            onChange={(ingredientId) =>
                                handleIngredientChange(field.id, 'ingredientId', String(ingredientId ?? ''))
                            }
                        >
                            <Select.Trigger>
                                <Select.Value aria-placeholder="Оберіть варіант" />
                            </Select.Trigger>
                            
                            <Select.Popover>
                                <ListBox>
                                    {ingredients.map((ingredient) => (
                                        <ListBox.Item key={ingredient.id} id={ingredient.id} className="text-black">
                                            {ingredient.name}
                                        </ListBox.Item>
                                    ))}
                                </ListBox>
                            </Select.Popover>

                        </Select>

                        <TextField
                            isRequired
                            name={`quantity_${index}`}
                            type="number"
                            className='w-full bg-default-100 text-sm focus:outline-none'
                            value={field.quantity !== null ? field.quantity.toString() : ''}
                            validate={(value) => 
                                !value || parseFloat(value) <= 0
                                    ? "Кількість повинна бути більше 0"
                                    : null
                            }
                        >
                            <Input
                                placeholder="Кількість"
                                className='w-full bg-default-100 text-sm focus:outline-none'
                                onChange={(e) => handleIngredientChange(
                                    field.id,
                                    "quantity",
                                    e.target.value ? parseFloat(e.target.value) : null
                                )}
                            />
                            <FieldError />
                        </TextField>
                        {ingredientFields.length > 1 && (
                            <Button
                                variant="danger-soft"
                                onPress={() => handleRemoveIngredientField(field.id)}
                                aria-label="Видалити інгредієнт"
                                className="h-11 min-w-11 rounded-full px-0 text-lg font-semibold">
                                -
                            </Button>
                        )}
                        {ingredientFields.length === 1 && <div aria-hidden="true" />}
                    </div>
                ))}

                {ingredientFields.length < 10 && (
                    <Button
                        variant="primary"
                        onPress={handleAddIngredientField}
                        aria-label="Додати інгредієнт"
                        className="h-11 min-w-11 self-start rounded-full px-0 text-lg font-semibold">
                        +
                    </Button>
                )}
            </div>

            <div className="flex w-full items-center justify-end pt-2">
                <Button variant="primary" type="submit" isPending={isPending} className="min-w-40 px-6 font-semibold">
                    {initialRecipe ? 'Зберегти зміни' : 'Додати рецепт'}
                </Button>
            </div>
        </Form>
    )
}

export default RecipeForm;
