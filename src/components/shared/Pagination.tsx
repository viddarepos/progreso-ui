import { Pagination as MuiPagination } from '@mui/material'

type PaginationProps = {
  totalPages: number
  pageNumber: number
  setPageNumber: (value: number) => void
  padding?: string
}

export default function Pagination({
  totalPages,
  pageNumber,
  setPageNumber,
  padding = '1em',
}: PaginationProps) {
  return (
    <MuiPagination
      count={totalPages}
      page={pageNumber + 1}
      onChange={(_, page) => {
        setPageNumber(page - 1)
      }}
      shape='rounded'
      sx={{
        '& .Mui-selected': {
          backgroundColor: 'grey.500',
          color: 'background.default',
        },
        '& .MuiPagination-ul': {
          justifyContent: 'center',
        },
        padding: padding,
      }}
    />
  )
}
