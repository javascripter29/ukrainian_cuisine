'use client';

import { Button } from "@heroui/react";
import Link from "next/link";

const NotFoundPage = () => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-8xl font-bold text-gray-300">404</div>

            <h1 className="text-3xl font-bold tracking-tight">Сторінка не знайдена</h1>

            <div className="pt-6">
                <Button className="text-gray-700" variant="ghost">
                    <Link href="/">
                        Повернутися на головну
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default NotFoundPage;