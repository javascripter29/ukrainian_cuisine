"use client";

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from "@/src/constants/select-options";
import { useAuthStore } from "@/src/store/auth.store";
import { useIngredientStore } from "@/src/store/ingredient.store";
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from "@heroui/react";

const IngredientsTable = () => {
    const { ingredients, removeIngredient, isLoading } = useIngredientStore();
    const { isAuth } = useAuthStore();

    const handleDelete = async (id: string) => {
        await removeIngredient(id);
    };

    const getCategoryLabel = (value: string) => {
        const option = CATEGORY_OPTIONS.find((opt) => opt.value === value);
        return option ? option.label : value;
    };

    const getUnitLabel = (value: string) => {
        const option = UNIT_OPTIONS.find((opt) => opt.value === value);
        return option ? option.label : value;
    };

    if (!isAuth) {
        return <p>Не авторизований</p>
    }

    if (isLoading) {
        return <p className="mt-4">Завантаження...</p>;
    }

    return (
        <Table className="mt-4 w-full text-black">
            <Table.Content aria-label="Список інгредієнтів" className="text-black">
                <TableHeader className="text-black">
                    <TableColumn isRowHeader>Назва</TableColumn>
                    <TableColumn>Категорія</TableColumn>
                    <TableColumn>Одиниця виміру</TableColumn>
                    <TableColumn>Ціна за одиницю</TableColumn>
                    <TableColumn>Опис</TableColumn>
                    <TableColumn>Дії</TableColumn>
                </TableHeader>

                <TableBody className='text-black'>
                    {ingredients.map((ingredient) => (
                        <TableRow key={ingredient.id} className="text-black">
                            <TableCell className="text-black">{ingredient.name}</TableCell>
                            <TableCell className="text-black">{getCategoryLabel(ingredient.category)}</TableCell>
                            <TableCell className="text-black">{getUnitLabel(ingredient.unit)}</TableCell>
                            <TableCell className="text-black">
                                {ingredient.pricePerUnit !== null
                                    ? ingredient.pricePerUnit
                                    : "-"}
                            </TableCell>
                            <TableCell className="text-black">{ingredient.description || "-"}</TableCell>
                            <TableCell className="text-black">
                                <Button
                                    isDisabled={!isAuth}
                                    size="sm"
                                    onPress={() => handleDelete(ingredient.id)}
                                >
                                    Видалити
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table.Content>
        </Table>
    );
};

export default IngredientsTable;
