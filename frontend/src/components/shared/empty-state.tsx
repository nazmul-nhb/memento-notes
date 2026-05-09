import { motion } from 'framer-motion';
import { FileQuestion } from 'lucide-react';

interface EmptyStateProps {
	title?: string;
	description?: string;
	icon?: React.ReactNode;
}

export function EmptyState({
	title = 'Nothing here yet',
	description = 'Get started by creating your first item.',
	icon,
}: EmptyStateProps) {
	return (
		<motion.div
			animate={{ opacity: 1, scale: 1 }}
			className="flex flex-col items-center justify-center py-16 text-center"
			initial={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.3 }}
		>
			<div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-white/5">
				{icon || <FileQuestion className="size-8 text-muted-foreground" />}
			</div>
			<h3 className="text-lg font-semibold text-white">{title}</h3>
			<p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
		</motion.div>
	);
}
