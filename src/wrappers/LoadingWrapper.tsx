import { TableCell, TableRow } from '@mui/material'
import Box from '@mui/material/Box'
import { type ReactNode, useEffect, useRef, useState } from 'react'

import LoadingSpinner from '../components/shared/LoadingSpinner'

type Props = {
  isLoading: boolean
  isAppLoading?: boolean
  tableColSpan?: number
  children?: ReactNode
}

const timer = 800

export default function LoadingWrapper({ isLoading, isAppLoading, tableColSpan, children }: Props) {
  const [isLoaderActive, setIsLoaderActive] = useState(isAppLoading ? true : false)
  const [hasTimerElapsed, setHasTimerElapsed] = useState(false)
  const timeoutId = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (isLoading) {
      setIsLoaderActive(true)
    } else if (hasTimerElapsed) {
      setIsLoaderActive(false)
    }

    if (!hasTimerElapsed) {
      timeoutId.current = setTimeout(() => {
        if (!isLoading) {
          setIsLoaderActive(false)
        }
        setHasTimerElapsed(true)
      }, timer)
    }

    return () => {
      clearTimeout(timeoutId.current)
      setHasTimerElapsed(false)
    }
  }, [isLoading])

  return (
    <>
      {isLoaderActive ? (
        <Box
          component={tableColSpan ? TableRow : Box}
          sx={
            !tableColSpan
              ? {
                  alignItems: 'center',
                  display: 'flex',
                  inset: '0',
                  justifyContent: 'center',
                  position: 'absolute',
                  zIndex: '1000',
                }
              : {}
          }
        >
          {tableColSpan ? (
            <TableCell colSpan={tableColSpan} align='center'>
              <LoadingSpinner />
            </TableCell>
          ) : (
            <LoadingSpinner />
          )}
        </Box>
      ) : (
        children
      )}
    </>
  )
}
