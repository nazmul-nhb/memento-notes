import { Skeleton } from '@/components/ui/skeleton';

export function CardSkeleton() {
	return (
		<div className="rounded-xl border border-white/10 bg-white/5 p-5">
			<div className="flex items-start justify-between">
				<div className="flex-1 space-y-2">
					<Skeleton className="h-5 w-3/4 bg-white/10" />
					<Skeleton className="h-3 w-1/3 bg-white/5" />
				</div>
			</div>
			<div className="mt-3 space-y-2">
				<Skeleton className="h-3 w-full bg-white/5" />
				<Skeleton className="h-3 w-5/6 bg-white/5" />
				<Skeleton className="h-3 w-2/3 bg-white/5" />
			</div>
			<div className="mt-4">
				<Skeleton className="h-5 w-24 rounded-full bg-white/5" />
			</div>
		</div>
	);
}

export function CardSkeletonGrid({ count = 6 }: { count?: number }) {
	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: count }, (_, i) => (
				<CardSkeleton key={i} />
			))}
		</div>
	);
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
	return (
		<div className="space-y-3">
			<div className="flex gap-4 rounded-lg bg-white/5 p-3">
				<Skeleton className="h-4 w-1/4 bg-white/10" />
				<Skeleton className="h-4 w-1/4 bg-white/10" />
				<Skeleton className="h-4 w-1/4 bg-white/10" />
				<Skeleton className="h-4 w-1/4 bg-white/10" />
			</div>
			{Array.from({ length: rows }, (_, i) => (
				<div className="flex gap-4 rounded-lg p-3" key={i}>
					<Skeleton className="h-4 w-1/4 bg-white/5" />
					<Skeleton className="h-4 w-1/4 bg-white/5" />
					<Skeleton className="h-4 w-1/4 bg-white/5" />
					<Skeleton className="h-4 w-1/4 bg-white/5" />
				</div>
			))}
		</div>
	);
}
