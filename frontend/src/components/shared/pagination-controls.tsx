import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { IPaginationMeta } from '@/types';

interface PaginationControlsProps {
    meta: IPaginationMeta;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    limitOptions?: number[];
}

export function PaginationControls({
    meta,
    onPageChange,
    onLimitChange,
    limitOptions = [10, 12, 20, 50],
}: PaginationControlsProps) {
    const { page, totalPages, total, limit } = meta;
    const currentLimit = limit || 10;

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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                    {total} total result{total !== 1 ? 's' : ''}
                </p>
                {onLimitChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Rows per page:</span>
                        <Select
                            defaultValue={String(currentLimit)}
                            onValueChange={(val) => onLimitChange(Number(val))}
                            value={String(currentLimit)}
                        >
                            <SelectTrigger className="h-8 w-18">
                                <SelectValue placeholder={String(currentLimit)} />
                            </SelectTrigger>
                            <SelectContent>
                                {limitOptions.map((opt) => (
                                    <SelectItem key={opt} value={String(opt)}>
                                        {opt}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination className="mx-0 w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                className={
                                    page <= 1
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
                                }
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page > 1) onPageChange(page - 1);
                                }}
                            />
                        </PaginationItem>

                        {pages.map((p, i) =>
                            p === '...' ? (
                                <PaginationItem key={`ellipsis-${i}`}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            ) : (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        className={
                                            p === page
                                                ? 'bg-violet-600 text-white hover:bg-violet-500 hover:text-white'
                                                : 'cursor-pointer'
                                        }
                                        href="#"
                                        isActive={p === page}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onPageChange(p as number);
                                        }}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            )
                        )}

                        <PaginationItem>
                            <PaginationNext
                                className={
                                    page >= totalPages
                                        ? 'pointer-events-none opacity-50'
                                        : 'cursor-pointer'
                                }
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (page < totalPages) onPageChange(page + 1);
                                }}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
