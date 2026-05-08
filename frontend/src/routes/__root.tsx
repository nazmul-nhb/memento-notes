import { createRootRoute, Outlet } from '@tanstack/react-router';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/navbar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

export const Route = createRootRoute({
    component: RootLayout,
});

function RootLayout() {
    return (
        <TooltipProvider>
            <div className="flex min-h-screen flex-col bg-background">
                <Navbar />
                <main className="flex-1">
                    <AnimatePresence mode="wait">
                        <Outlet />
                    </AnimatePresence>
                </main>

                {/* Subtle gradient footer glow */}
                <footer className="border-t border-white/5 py-6 text-center text-xs text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()}{' '}
                        <span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                            Memento Notes
                        </span>
                        . All rights reserved.
                    </p>
                </footer>
            </div>
            <Toaster
                position="top-right"
                richColors
                theme="dark"
                toastOptions={{
                    className: 'border-white/10 bg-card',
                }}
            />
        </TooltipProvider>
    );
}
