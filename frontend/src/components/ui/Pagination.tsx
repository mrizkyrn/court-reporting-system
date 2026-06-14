import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages: (number | string)[] = [];
  const maxVisiblePages = 5;
  const halfWindow = Math.floor(maxVisiblePages / 2);

  // Generate page numbers to display
  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    if (currentPage > halfWindow + 1) {
      pages.push('...');
    }

    const startPage = Math.max(2, currentPage - halfWindow);
    const endPage = Math.min(totalPages - 1, currentPage + halfWindow);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - halfWindow - 1) {
      pages.push('...');
    }

    pages.push(totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        variant="outline"
        size="icon-sm"
        aria-label="Previous page"
      >
        <ChevronLeft />
      </Button>

      {pages.map((page, idx) => (
        <React.Fragment key={`${page}-${idx}`}>
          {page === '...' ? (
            <span className="px-2 text-gray-500">...</span>
          ) : (
            <Button
              onClick={() => onPageChange(page as number)}
              variant={currentPage === page ? 'default' : 'outline'}
              size="icon-sm"
              className={cn(
                currentPage === page && 'pointer-events-none'
              )}
              aria-label={`Go to page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </Button>
          )}
        </React.Fragment>
      ))}

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        variant="outline"
        size="icon-sm"
        aria-label="Next page"
      >
        <ChevronRight />
      </Button>
    </div>
  );
};
