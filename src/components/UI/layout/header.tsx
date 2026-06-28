'use client';

import { layoutConfig } from "@/src/config/layout.config";
import { siteConfig } from "@/src/config/site.config";
import { Link, Button } from "@heroui/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import RegistrationModal from "../modals/registration.modal";
import LoginModal from "../modals/login.modal";
import { useState } from "react";
import { signOutFunc } from "@/src/actions/sign-out";
import { useAuthStore } from "@/src/store/auth.store";

export const Logo = () => {
    return <Image src="/logo.png" alt={siteConfig.title} width={26} height={26} />
}

export default function Header() {
    const pathname = usePathname();
    const { isAuth, session, status, setAuthState } = useAuthStore()
    const [isRegistrationOpen, setRegistrationOpen] = useState(false)
    const [isLoginOpen, setIsLoginOpen] = useState(false)

    const handleSignOut = async () => {
        try {
            await signOutFunc()
        } catch (error) {
            console.log('error', error)
        }

        setAuthState('unauthenticated', null)
    }

    const getNavItems = () => {
        return siteConfig.navItems
            .filter((item) => {
                if (item.href === '/ingredients') {
                    return isAuth;
                }

                return true;
            })
            .map((item) => {
                const isActive = pathname === item.href

                return (
                    <li key={item.href}>
                        <Link
                            className={`rounded-md px-3 py-1 transition-colors duration-200 ${
                                isActive ? "text-blue-500" : "text-foreground"
                            } hover:text-blue-300`}
                            href={item.href}
                        >
                            {item.label}
                        </Link>
                    </li>
                )
            })
    }

    return (
        <nav style={{ minHeight: `${layoutConfig.headerHeight}` }}>
            <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3 sm:gap-5 sm:px-6">
                <div className="flex min-w-0 items-center gap-3">
                    <Link href="/" className="flex gap-1">
                        <Logo />
                        <p className="truncate font-bold text-inherit">{siteConfig.title}</p>
                    </Link>
                </div>

                <ul className="order-3 hidden w-full justify-center gap-4 sm:flex lg:order-none lg:w-auto">
                    {getNavItems()}
                </ul>

                <ul className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2 sm:gap-3">
                    {status === 'loading' ? (
                        <p className="text-sm text-foreground/70">Загрузка...</p>
                    ) : !isAuth ? (
                        <>
                            <li className="flex">
                                <Button
                                    variant="secondary"
                                    className="h-9 rounded-full border border-white/15 bg-white/10 px-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-white/15 sm:h-10 sm:px-5 sm:text-base"
                                    onPress={() => setIsLoginOpen(true)}
                                >
                                    Увійти
                                </Button>
                            </li>
                            <li>
                                <Button
                                    variant="primary"
                                    className="h-9 rounded-full px-3 text-sm font-semibold shadow-md shadow-blue-500/20 transition-transform hover:-translate-y-0.5 sm:h-10 sm:px-5 sm:text-base"
                                    onPress={() => setRegistrationOpen(true)}
                                >
                                    Реєстрація
                                </Button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="max-w-[calc(100vw-120px)] truncate rounded-full border border-white/10 bg-white/10 px-3 py-2 text-sm font-medium text-white shadow-sm sm:max-w-[260px] sm:px-4">
                                <span className="text-white/70">Привіт, </span>
                                <span>{session?.user?.email}</span>
                            </li>
                            <li className="flex">
                                <Button
                                    variant="secondary"
                                    className="h-9 rounded-full border border-white/15 bg-transparent px-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 sm:h-10 sm:px-5 sm:text-base"
                                    onPress={handleSignOut}
                                >
                                    Вийти
                                </Button>
                            </li>
                        </>
                    )}
                </ul>
            </header>

            <RegistrationModal
                isOpen={isRegistrationOpen}
                onClose={() => setRegistrationOpen(false)}
            />

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
            />
        </nav>
    )
}
