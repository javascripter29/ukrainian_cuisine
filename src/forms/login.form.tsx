'use client';

import { Button, FieldError, Form, Input, TextField } from "@heroui/react"
import type { FormEvent } from "react";
import { useState } from "react";
import { sigInWithCredentials } from "../actions/sign-in";

interface IProps {
    onClose: () => void;
}

const LoginForm = ({ onClose }: IProps) => {
    const [submitError, setSubmitError] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const validateEmail = (value: string) => {
        if (!value) {
            return "Пошта обов'язкова";
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

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitError("");

        const result = await sigInWithCredentials(formData.email, formData.password)

        if ("error" in result) {
            setSubmitError(result.error ?? "Не вдалося увійти. Спробуйте ще раз");
            return;
        }

        window.location.reload();

        onClose();
    }

    return (
    <Form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
        <TextField
            isRequired
            validate={validateEmail}
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

        {submitError ? (
            <p className="text-sm text-danger" role="alert">
                {submitError}
            </p>
        ) : null}

        <div className="flex w-full flex-wrap items-center justify-end gap-3 pt-6">
            <Button variant="secondary" onPress={onClose}>
                Відміна
            </Button>
            <Button type="submit">
                Увійти
            </Button>
        </div>
    </Form>

    )
}

export default LoginForm
