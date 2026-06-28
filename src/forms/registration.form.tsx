'use client';

import { Button, FieldError, Form, Input, TextField } from "@heroui/react"
import type { FormEvent } from "react";
import { useState } from "react";
import { registerUser } from "../actions/register";


interface IProps {
    onClose: () => void;
}

const RegistrationForm = ({ onClose }: IProps) => {
    const [submitError, setSubmitError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const validateEmailField = (value: string) => {
        if (!value) {
            return "Пошта обов'язкова";
        }

        if (!validateEmail(value)) {
            return "Неправильно введені дані";
        }

        return true;
    }

    const validatePassword = (value: string) => {
        if (!value) {
            return "Пароль обов'язковий";
        }

        if (value.length < 6) {
            return "Пароль повинен бути не менше 6 символів!";
        }

        return true;
    }

    const validateConfirmPassword = (value: string) => {
        if (!value) {
            return "Пароль для підтвердження обов'язковий";
        }

        if (value !== formData.password) {
            return "Паролі не збігаються";
        }

        return true;
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError("");
        console.log("Form submitted:", formData)

        const result = await registerUser(formData);

        console.log('Result: ', result)

        if ("error" in result) {
            setSubmitError(result.error ?? "Registration failed");
            return;
        }

        onClose();
    }

    return (
    <Form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        <TextField
            isRequired
            validate={validateEmailField}
            className="w-full"
        >
            <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                aria-label="Email"
                placeholder="Введіть email"
                className="w-full bg-default-100 text-sm focus:outline-none"
            />
            <FieldError />
        </TextField>
        <TextField
            isRequired
            validate={validatePassword}
            className="w-full"
        >
            <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Введіть пароль"
                className="w-full bg-default-100 text-sm focus:outline-none"
            />
            <FieldError />
        </TextField>
        <TextField
            isRequired
            validate={validateConfirmPassword}
            className="w-full"
        >
            <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Підтвердіть пароль"
                className="w-full bg-default-100 text-sm focus:outline-none"
            />
            <FieldError />
        </TextField>

        {submitError ? (
            <p className="text-sm text-danger" role="alert">
                {submitError}
            </p>
        ) : null}

        <div className="flex w-[100%] gap-4 items-center pt-8 justify-end">
            <Button variant="secondary" onPress={onClose}>
                Відміна
            </Button>
            <Button type="submit">
                Зареєструватися
            </Button>
        </div>
    </Form>

    )
}

export default RegistrationForm
