import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

type ToastData = {
    title: string;
    message: ReactNode;
};

interface ToastContextType {
    toast: ToastData | null;
    showToast: (title: string, message: ReactNode) => void;
    hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastData | null>(null);

    const hideToast = useCallback(() => {
        setToast(null);
    }, []);

    const showToast = useCallback((title: string, message: ReactNode) => {
        setToast({ title, message });

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setToast(null);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ toast, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
