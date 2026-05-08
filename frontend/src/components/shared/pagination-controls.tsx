import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { IPaginationMeta } from '@/types';

interface PaginationControlsProps {
    meta: IPaginationMeta;
    onPageChange: (page: number) => void;
}

export function PaginationControls({ meta, onPageChange }: PaginationControlsProps) {
    const { page, totalPages, total } = meta;

    if (totalPages <= 1) return null;

    const pages: (number | '...')[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (page > 3) pages.push('...');
        for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
            pages.push(i);
        }
        if (page < totalPages - 2) pages.push('...');
        pages.push(totalPages);
    }

    return (
        <div className="flex items-center justify-between pt-4">
            <p className="text-sm text-muted-foreground">
                {total} total result{total !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center gap-1">
                <Button
                    disabled={page <= 1}
                    onClick={() => onPageChange(page - 1)}
                    size="icon-sm"
                    variant="outline"
                >
                    <ChevronLeft className="size-4" />
                </Button>

                {pages.map((p, i) =>
                    p === '...' ? (
                        <span
                            className="px-1 text-sm text-muted-foreground"
                            key={`ellipsis-${i}`}
                        >
                            ...
                        </span>
                    ) : (
                        <Button
                            className={
                                p === page ? 'bg-violet-600 text-white hover:bg-violet-500' : ''
                            }
                            key={p}
                            onClick={() => onPageChange(p)}
                            size="icon-sm"
                            variant={p === page ? 'default' : 'outline'}
                        >
                            {p}
                        </Button>
                    )
                )}

                <Button
                    disabled={page >= totalPages}
                    onClick={() => onPageChange(page + 1)}
                    size="icon-sm"
                    variant="outline"
                >
                    <ChevronRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}
