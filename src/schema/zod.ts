import { number, object, string } from "zod"
import {z} from 'zod'
 
export const signInSchema = object({
  email: string("Email is required")
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string("Password is required")
    .min(1, "Password is required")
    .min(6, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const ingredientSchema = object({
  name: string().min(1, "Назва обов'язкова"),
  category: z.enum([
    'VEGETABLES',
    'FRUITS',
    'MEAT',
    'DAIRY',
    'SPICES',
    'OTHER'
  ]),
  unit: z.enum(['GRAMS', 'KILOGRAMS', 'LITERS', 'MILILITERS', 'PIECES']),
  pricePerUnit: number({ error: 'Ціна повинна бути числом'})
    .min(0, 'Ціна повинна бути додатньою')
    .nullable(),
  description: z.string().optional()
})
