import '@/styles.css';

import { createRouter, RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from '@/providers/auth-provider';
import { QueryProvider } from '@/providers/query-provider';
import { routeTree } from '@/routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

const root = document.getElementById('root') as HTMLElement;

createRoot(root).render(
    <StrictMode>
        <QueryProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </QueryProvider>
    </StrictMode>
);
