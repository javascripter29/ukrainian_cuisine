"use client";

import { Button, FieldError, Form, Input, ListBox, Select, TextField } from "@heroui/react";
import { useState, useTransition } from "react";
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "../constants/select-options";
import { createIngredient } from "../actions/ingredients";
import { useIngredientStore } from "../store/ingredient.store";

const initialState = {
                name: '',
                category: '',
                unit: '',
                pricePerUnit: null as number | null,
                description: ''
            }

const IngredientForm = () => {
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState(initialState);
    const { addIngredient } = useIngredientStore()
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (formData: FormData) => {
        console.log("Form submitted: ", formData);

        startTransition(async () => {
            await createIngredient(formData)
            const storeError = useIngredientStore.getState().error

            if (storeError) {
                setError(storeError);
            } else {
                setError(null);
                setFormData(initialState);
            }
        })
    };

    return (
        <Form className="flex w-full flex-col gap-4" action={handleSubmit}>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <TextField
                isRequired
                name="name"
                type="text"
                value={formData.name}
                className="w-full"
                validate={(value) => {
                    if (!value) return "Назва обов'язкова";
                    return true;
                }}
                onChange={(name) => setFormData({ ...formData, name })}
            >
                <Input
                    aria-label="name"
                    placeholder="Введіть назву інгредієнта"
                    className="w-full bg-default-100 text-sm focus:outline-none"
                />
                <FieldError />
            </TextField>

            <Select
                isRequired
                name="category"
                selectedKey={formData.category || null}
                placeholder="Категорія"
                className="w-full truncate bg-default-100 text-sm text-black"
                onChange={(category) => setFormData({ ...formData, category: String(category ?? "") })}
            >
                <Select.Trigger>
                    <Select.Value aria-placeholder="Оберіть варіант" />
                </Select.Trigger>
                <Select.Popover>
                    <ListBox>
                        {CATEGORY_OPTIONS.map((option) => (
                            <ListBox.Item key={option.value} id={option.value} className="text-black">
                                {option.label}
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>
            </Select>

            <Select
                isRequired
                name="unit"
                selectedKey={formData.unit || null}
                placeholder="Одиниці виміру"
                className="w-full truncate bg-default-100 text-sm text-black"
                onChange={(unit) => setFormData({ ...formData, unit: String(unit ?? "") })}
            >
                <Select.Trigger>
                    <Select.Value aria-placeholder="Оберіть варіант" />
                </Select.Trigger>
                <Select.Popover>
                    <ListBox>
                        {UNIT_OPTIONS.map((option) => (
                            <ListBox.Item key={option.value} id={option.value} className="text-black">
                                {option.label}
                            </ListBox.Item>
                        ))}
                    </ListBox>
                </Select.Popover>
            </Select>

            <TextField
                isRequired
                name="pricePerUnit"
                type="number"
                value={formData.pricePerUnit !== null ? formData.pricePerUnit.toString() : ""}
                className="w-full"
                validate={(value) => {
                    if (!value) return "Ціна обов'язкова!";

                    const num = parseFloat(value);
                    if (Number.isNaN(num) || num < 0) {
                        return "Ціна повинна бути додатньою!";
                    }

                    return true;
                }}
                onChange={(pricePerUnit) => {
                    const value = pricePerUnit ? parseFloat(pricePerUnit) : null;
                    setFormData({ ...formData, pricePerUnit: value });
                }}
            >
                <div className="relative w-full">
                    <Input
                        placeholder="Ціна"
                        className="w-full bg-default-100 pr-7 text-sm focus:outline-none"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                        $
                    </span>
                </div>
                <FieldError />
            </TextField>

            <TextField
                name="description"
                type="text"
                value={formData.description}
                className="w-full"
                onChange={(description) => setFormData({ ...formData, description })}
            >
                <Input
                    placeholder="Введіть опис (необов'язково)"
                    className="w-full bg-default-100 text-sm focus:outline-none"
                />
            </TextField>

            <div className="flex w-full items-center justify-end pt-2">
                <Button isPending={isPending} type="submit">
                    Додати інгредієнт
                </Button>
            </div>
        </Form>
    );
};

export default IngredientForm;
