import React from 'react';
import { Button } from 'reactstrap';

interface PaginationProps {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { page, totalPages, total } = pagination;

  const handleFirstPage = () => onPageChange(1);
  const handlePreviousPage = () => onPageChange(page - 1);
  const handleNextPage = () => onPageChange(page + 1);
  const handleLastPage = () => onPageChange(totalPages);

  return (
    <div className='pagination-container'>
      <Button className='firstAndLast' onClick={handleFirstPage} disabled={page <= 1}>
        First
      </Button>
      <Button className='prevAndNext' onClick={handlePreviousPage} disabled={page <= 1}>
        Previous
      </Button>
      <span className='pageInfoZone'>
        Page <span>{page}</span> of <span>{totalPages}</span> (<span>{total} </span>items)
      </span>
      <Button className='prevAndNext' onClick={handleNextPage} disabled={page >= totalPages}>
        Next
      </Button>
      <Button className='firstAndLast' onClick={handleLastPage} disabled={page >= totalPages}>
        Last
      </Button>
    </div>
  );
};

export default Pagination;
