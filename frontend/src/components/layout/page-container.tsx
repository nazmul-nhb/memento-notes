import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageContainerProps {
	children: ReactNode;
	className?: string;
}

export function PageContainer({ children, className = '' }: PageContainerProps) {
	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${className}`}
			exit={{ opacity: 0, y: -20 }}
			initial={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
		>
			{children}
		</motion.div>
	);
}
