import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, saveToken, removeToken } from "@/lib/api";

interface User {
    id: number;
    name: string;
    email: string;
    role: "teacher" | "student";
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: "teacher" | "student") => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

        // Don't use token if it's the string "undefined"
    const validToken = storedToken && storedToken !== "undefined" ? storedToken : null;
    const validUser = storedUser && storedUser !== "undefined" ? storedUser : null;

    if (validToken && validUser) {
        try {
            setToken(validToken);
                setUser(JSON.parse(validUser));
        } catch (error) {
                // Clear corrupted localStorage data
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                console.error("Failed to parse stored user data:", error);
            }
    }
    setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        const response = await authApi.login({ email, password });

        // API returns { success: true, data: { user: {...}, token: "..." } }
        const { data } = response as { data: { token: string; user: User } };
        const { token: newToken, user: newUser } = data;

        if (!newToken || !newUser) {
            throw new Error('Login failed - no token or user received');
        }

        saveToken(newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const register = async (name: string, email: string, password: string, role: "teacher" | "student") => {
        const response = await authApi.register({ name, email, password, role });

        // API returns { success: true, data: { user: {...}, token: "..." } }
        const { data } = response as { data: { token: string; user: User } };
        const { token: newToken, user: newUser } = data;

        if (!newToken || !newUser) {
            throw new Error('Registration failed - no token or user received');
        }

        saveToken(newToken);
        localStorage.setItem("user", JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        removeToken();
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
