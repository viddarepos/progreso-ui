import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import type { ReactNode } from 'react'

import LoadingWrapper from '../../wrappers/LoadingWrapper'
import Pagination from '../shared/Pagination'

type Props = {
  isLoading: boolean
  pageNumber: number
  totalPages: number
  handleChangePage: (pageNumber: number) => void
  children?: ReactNode
}

export default function TechnologiesTable({
  children,
  isLoading,
  pageNumber,
  totalPages,
  handleChangePage,
}: Props) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        margin: '2rem auto',
      }}
    >
      <Table>
        <TableHead sx={{ backgroundColor: 'grey.500' }}>
          <TableRow>
            <TableCell align='center' sx={{ color: 'common.white', width: '70%' }}>
              Name
            </TableCell>
            <TableCell
              sx={{
                color: 'common.white',
                width: '30%',
              }}
              align='center'
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <LoadingWrapper isLoading={isLoading} tableColSpan={2}>
            {children ? (
              children
            ) : (
              <TableRow>
                <TableCell colSpan={2} align='center'>
                  No technologies found
                </TableCell>
              </TableRow>
            )}
          </LoadingWrapper>
        </TableBody>
      </Table>
      <Pagination
        pageNumber={pageNumber}
        totalPages={totalPages}
        setPageNumber={handleChangePage}
      />
    </TableContainer>
  )
}
