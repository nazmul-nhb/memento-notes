import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2 } from 'lucide-react';
import { formatDate, isValidObject } from 'nhb-toolbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { INote } from '@/types';

interface NoteCardProps {
    note: INote;
    onEdit?: (note: INote) => void;
    onDelete?: (id: string) => void;
    showAuthor?: boolean;
}

export function NoteCard({ note, onEdit, onDelete, showAuthor }: NoteCardProps) {
    const author = isValidObject(note.user_id) ? note.user_id : null;

    return (
        <motion.div
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.95 }}
            layout
            transition={{ duration: 0.2 }}
            whileHover={{ y: -2 }}
        >
            <Card className="group relative overflow-hidden border-white/10 bg-white/5 backdrop-blur-sm transition-all hover:border-violet-500/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-violet-500/5">
                {/* Gradient accent */}
                <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-white">
                            {note.title}
                        </h3>
                        {showAuthor && author && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                by {author.name}
                            </p>
                        )}
                    </div>
                    {(onEdit || onDelete) && (
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            {onEdit && (
                                <Button
                                    onClick={() => onEdit(note)}
                                    size="icon-xs"
                                    variant="ghost"
                                >
                                    <Edit className="size-3.5 text-muted-foreground" />
                                </Button>
                            )}
                            {onDelete && (
                                <Button
                                    onClick={() => onDelete(note._id)}
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
                        {note.content}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                        <Badge
                            className="border-white/10 bg-white/5 text-xs text-muted-foreground"
                            variant="outline"
                        >
                            <Calendar className="mr-1 size-3" />
                            {formatDate({
                                date: note.created_at,
                                format: 'mmm D, yyyy hh:mma',
                            })}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
