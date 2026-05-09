import { Link } from '@tanstack/react-router';
import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2, User } from 'lucide-react';
import { formatDate, isValidObject } from 'nhb-toolbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { IPost } from '@/types';

interface PostCardProps {
	post: IPost;
	onEdit?: (post: IPost) => void;
	onDelete?: (id: string) => void;
	isOwner?: boolean;
}

export function PostCard({ post, onEdit, onDelete, isOwner }: PostCardProps) {
	const author = isValidObject(post.user_id) ? post.user_id : null;

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			initial={{ opacity: 0, y: 10 }}
			layout
			transition={{ duration: 0.2 }}
			whileHover={{ y: -2 }}
		>
			<Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-indigo-500/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-indigo-500/5">
				<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

				<CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
					<div className="min-w-0 flex-1">
						<Link
							className="group/link"
							params={{ postId: post._id }}
							to="/posts/$postId"
						>
							<h3 className="truncate text-base font-semibold text-white transition-colors group-hover/link:text-violet-400">
								{post.title}
							</h3>
						</Link>
						{author && (
							<div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
								<User className="size-3" />
								<span>{author.name}</span>
							</div>
						)}
					</div>
					{isOwner && (onEdit || onDelete) && (
						<div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
							{onEdit && (
								<Button
									onClick={() => onEdit(post)}
									size="icon-xs"
									variant="ghost"
								>
									<Edit className="size-3.5 text-muted-foreground" />
								</Button>
							)}
							{onDelete && (
								<Button
									onClick={() => onDelete(post._id)}
									size="icon-xs"
									variant="ghost"
								>
									<Trash2 className="size-3.5 text-destructive" />
								</Button>
							)}
						</div>
					)}
				</CardHeader>

				<CardContent className="pt-0">
					<p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
						{post.body}
					</p>
					<div className="mt-3 flex items-center gap-2">
						<Badge
							className="border-white/10 bg-white/5 text-xs text-muted-foreground"
							variant="outline"
						>
							<Calendar className="mr-1 size-3" />
							{formatDate({
								date: post.created_at,
								format: 'mmm D, yyyy hh:mma',
							})}
						</Badge>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
