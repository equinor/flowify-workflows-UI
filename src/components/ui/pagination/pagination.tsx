import React, { FC } from 'react';
import { Select } from '@form';
import { Button, Stack } from '@ui';

interface PaginationProps {
  page: number;
  total: number;
  onPageChange: React.Dispatch<React.SetStateAction<number>> | ((page: number) => void);
  itemsPerPage?: number;
}

export const Pagination: FC<PaginationProps> = (props: PaginationProps) => {
  const { page, total, itemsPerPage, onPageChange } = props;

  const divided = total / itemsPerPage!;
  const pages = divided < 1 ? 1 : divided;

  function createPagesArray() {
    const pagesArray = [];
    for (let i = 1; i <= pages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  const pagesArray = createPagesArray();
  const pagesOptions = pagesArray.map((page) => ({ label: page.toString(), value: page.toString() }));

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Button disabled={page === 1} icon="chevron_left" onClick={() => onPageChange(page - 1)} />
      <Select
        name="pagination_page"
        value={`${page}`}
        options={pagesOptions}
        onChange={(item: string) => onPageChange(parseInt(item, 10))}
      />
      <span>of {isNaN(pages) ? 1 : pages}</span>
      <Button disabled={page === pages} icon="chevron_right" onClick={() => onPageChange(page + 1)} />
    </Stack>
  );
};

Pagination.defaultProps = {
  itemsPerPage: 10,
};
