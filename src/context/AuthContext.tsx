import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import type { UserProfile } from "@/types";

type AuthState = {
	user: UserProfile | null;
	loading: boolean;
	loginWithGoogle: () => void;
	logout: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<UserProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMe = async () => {
			try {
				const res = await fetch(`${API_BASE}/api/me`, {
					credentials: "include",
				});
				if (res.ok) {
					const data = await res.json();
					if (data?.authenticated && data?.user) {
						setUser(data.user as UserProfile);
					} else {
						setUser(null);
					}
				} else {
					setUser(null);
				}
			} catch {
				setUser(null);
			} finally {
				setLoading(false);
			}
		};
		fetchMe();
	}, []);

	const loginWithGoogle = () => {
		window.location.href = `${API_BASE}/auth/google`;
	};

	const logout = async () => {
		await fetch(`${API_BASE}/api/logout`, { method: "POST", credentials: "include" });
		setUser(null);
	};

	const value = useMemo(
		() => ({ user, loading, loginWithGoogle, logout }),
		[user, loading]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}

export function RequireAuth({ children }: { children: ReactNode }) {
	const { user, loading } = useAuth();
	if (loading) return null;
	if (!user) return null;
	return <>{children}</>;
}


