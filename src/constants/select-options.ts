export const CATEGORY_OPTIONS = [
    {value: 'VEGETABLES', label: 'Овочі'},
    {value: 'FRUITS', label: 'Фрукти'},
    {value: 'MEAT', label: 'Мясо'},
    {value: 'DAIRY', label: 'Молочна продукція'},
    {value: 'SPICES', label: 'Спеції'},
    {value: 'OTHER', label: 'Інше'},
] as const;

export const UNIT_OPTIONS = [
    {value: 'GRAMS', label: 'Грамми'},
    {value: 'KILOGRAMS', label: 'Кілограми'},
    {value: 'LITERS', label: 'Літри'},
    {value: 'MILILITERS', label: 'Мілілітри'},
    {value: 'PIECES', label: 'Штуки'},
] as const;

export const UNIT_ABBREVIATIONS = [
    { value: 'GRAMS', label: 'г' },
    { value: 'KILOGRAMS', label: 'Кг' },
    { value: 'LITERS', label: 'л' },
    { value: 'MILILITERS', label: 'мл' },
    { value: 'PIECES', label: 'шт' }
] as const;