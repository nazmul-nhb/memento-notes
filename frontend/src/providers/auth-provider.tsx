import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAccessToken, removeAccessToken, setAccessToken } from '@/lib/axios';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';
import type { ICurrentUser, ILoginPayload, IRegisterPayload, TUserRole } from '@/types';

interface AuthContextValue {
	user: ICurrentUser | null;
	token: string | null;
	isAuthenticated: boolean;
	isAdmin: boolean;
	isLoading: boolean;
	login: (payload: ILoginPayload) => Promise<void>;
	register: (payload: IRegisterPayload) => Promise<void>;
	logout: () => void;
	setUser: (user: ICurrentUser | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<ICurrentUser | null>(null);
	const [token, setToken] = useState<string | null>(getAccessToken());
	const [isLoading, setIsLoading] = useState(true);

	const isAuthenticated = !!token && !!user;
	const isAdmin = user?.role === ('admin' as TUserRole);

	// Hydrate user on mount if token exists
	useEffect(() => {
		const hydrate = async () => {
			const existingToken = getAccessToken();
			if (!existingToken) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await userService.getCurrentUser();
				setUser(response.data);
				setToken(existingToken);
			} catch {
				// Token is invalid, clean up
				removeAccessToken();
				setToken(null);
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		};

		hydrate();
	}, []);

	const login = useCallback(async (payload: ILoginPayload) => {
		const response = await authService.login(payload);
		const { user: loggedInUser, token: accessToken } = response.data;
		setAccessToken(accessToken);
		setToken(accessToken);
		setUser(loggedInUser);
	}, []);

	const register = useCallback(async (payload: IRegisterPayload) => {
		await authService.register(payload);
	}, []);

	const logout = useCallback(() => {
		removeAccessToken();
		setToken(null);
		setUser(null);
	}, []);

	const value = useMemo(
		() => ({
			user,
			token,
			isAuthenticated,
			isAdmin,
			isLoading,
			login,
			register,
			logout,
			setUser,
		}),
		[user, token, isAuthenticated, isAdmin, isLoading, login, register, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
}
