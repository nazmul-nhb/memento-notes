import { Link, useNavigate, useRouterState } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import {
	BookOpen,
	ChevronDown,
	LogOut,
	Menu,
	NotebookPen,
	Shield,
	StickyNote,
	User,
	X,
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/providers/auth-provider';

const navLinks = [
	{ to: '/', label: 'Home', icon: BookOpen },
	{ to: '/posts', label: 'Posts', icon: StickyNote },
] as const;

const authNavLinks = [{ to: '/notes', label: 'Notes', icon: NotebookPen }] as const;

export function Navbar() {
	const { user, isAuthenticated, isAdmin, logout } = useAuth();
	const navigate = useNavigate();
	const routerState = useRouterState();
	const [isMobileOpen, setIsMobileOpen] = useState(false);

	const currentPath = routerState.location.pathname;

	const handleLogout = () => {
		logout();
		navigate({ to: '/login' });
	};

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<nav className="sticky top-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl">
			<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<Link
					className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
					to="/"
				>
					<div className="flex size-9 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
						<NotebookPen className="size-5 text-white" />
					</div>
					<span className="bg-linear-to-r from-violet-400 to-indigo-400 bg-clip-text text-lg font-bold text-transparent">
						Memento
					</span>
				</Link>

				{/* Desktop Nav */}
				<div className="hidden items-center gap-1 md:flex">
					{navLinks.map((link) => (
						<Link
							className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
								currentPath === link.to
									? 'bg-white/10 text-white'
									: 'text-muted-foreground hover:bg-white/5 hover:text-white'
							}`}
							key={link.to}
							to={link.to}
						>
							<link.icon className="size-4" />
							{link.label}
						</Link>
					))}

					{isAuthenticated &&
						authNavLinks.map((link) => (
							<Link
								className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
									currentPath === link.to
										? 'bg-white/10 text-white'
										: 'text-muted-foreground hover:bg-white/5 hover:text-white'
								}`}
								key={link.to}
								to={link.to}
							>
								<link.icon className="size-4" />
								{link.label}
							</Link>
						))}

					{isAdmin && (
						<Link
							className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
								currentPath === '/admin'
									? 'bg-white/10 text-white'
									: 'text-muted-foreground hover:bg-white/5 hover:text-white'
							}`}
							to="/admin"
						>
							<Shield className="size-4" />
							Admin
						</Link>
					)}
				</div>

				{/* Right Side */}
				<div className="flex items-center gap-3">
					{isAuthenticated ? (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									className="gap-2 rounded-full px-2"
									size="sm"
									variant="ghost"
								>
									<Avatar className="size-7">
										<AvatarFallback className="bg-linear-to-br from-violet-500 to-indigo-600 text-xs text-white">
											{user ? getInitials(user.name) : '?'}
										</AvatarFallback>
									</Avatar>
									<span className="hidden text-sm md:inline">
										{user?.name}
									</span>
									<ChevronDown className="size-3 text-muted-foreground" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-48">
								<DropdownMenuItem onClick={() => navigate({ to: '/profile' })}>
									<User className="mr-2 size-4" />
									Profile
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem
									className="text-destructive focus:text-destructive"
									onClick={handleLogout}
								>
									<LogOut className="mr-2 size-4" />
									Logout
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					) : (
						<div className="flex items-center gap-2">
							<Link to="/login">
								<Button size="sm" variant="ghost">
									Login
								</Button>
							</Link>
							<Link to="/register">
								<Button
									className="bg-linear-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500"
									size="sm"
								>
									Sign Up
								</Button>
							</Link>
						</div>
					)}

					{/* Mobile Toggle */}
					<Button
						className="md:hidden"
						onClick={() => setIsMobileOpen(!isMobileOpen)}
						size="icon"
						variant="ghost"
					>
						{isMobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			<AnimatePresence>
				{isMobileOpen && (
					<motion.div
						animate={{ height: 'auto', opacity: 1 }}
						className="overflow-hidden border-t border-white/10 md:hidden"
						exit={{ height: 0, opacity: 0 }}
						initial={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<div className="space-y-1 px-4 py-3">
							{navLinks.map((link) => (
								<Link
									className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
										currentPath === link.to
											? 'bg-white/10 text-white'
											: 'text-muted-foreground hover:bg-white/5 hover:text-white'
									}`}
									key={link.to}
									onClick={() => setIsMobileOpen(false)}
									to={link.to}
								>
									<link.icon className="size-4" />
									{link.label}
								</Link>
							))}
							{isAuthenticated &&
								authNavLinks.map((link) => (
									<Link
										className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
											currentPath === link.to
												? 'bg-white/10 text-white'
												: 'text-muted-foreground hover:bg-white/5 hover:text-white'
										}`}
										key={link.to}
										onClick={() => setIsMobileOpen(false)}
										to={link.to}
									>
										<link.icon className="size-4" />
										{link.label}
									</Link>
								))}
							{isAdmin && (
								<Link
									className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
										currentPath === '/admin'
											? 'bg-white/10 text-white'
											: 'text-muted-foreground hover:bg-white/5 hover:text-white'
									}`}
									onClick={() => setIsMobileOpen(false)}
									to="/admin"
								>
									<Shield className="size-4" />
									Admin
								</Link>
							)}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</nav>
	);
}
