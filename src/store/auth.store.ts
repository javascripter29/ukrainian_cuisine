import { Session } from 'next-auth';
import { create } from 'zustand'

type SessionStaus = 'authenticated' | 'unauthenticated' | 'loading'

interface AuthState {
    isAuth: boolean;
    status: SessionStaus;
    session: Session | null
    setAuthState: (status: SessionStaus, session: Session | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuth: false,
    status: 'unauthenticated',
    session: null,
    setAuthState: (status: SessionStaus, session: Session | null) =>
        set({
            isAuth: status === 'authenticated',
            status,
            session
        })
}))