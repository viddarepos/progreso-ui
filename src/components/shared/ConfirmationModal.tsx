import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

type ConfirmationModal = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  content: string
  confirmButtonText: string
  isLoading: boolean
}

export default function ConfirmationModal({
  open,
  onClose,
  title,
  content,
  onConfirm,
  confirmButtonText,
  isLoading,
}: ConfirmationModal) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          padding: '1rem 2rem',
        },
        zIndex: '9999',
      }}
    >
      <DialogTitle
        sx={{
          textAlign: 'center',
        }}
      >
        {title}
      </DialogTitle>
      <DialogContent
        sx={{
          borderBottom: '1px solid',
          borderBottomColor: 'grey.400',
          marginBottom: '1.5rem',
          padding: ' 0 0 2rem 0',
          textAlign: 'center',
        }}
      >
        <DialogContentText sx={{ whiteSpace: 'break-spaces' }}>{content}</DialogContentText>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
        }}
      >
        <Button onClick={onClose} variant='outlined' sx={{ flexBasis: 0, flexGrow: 1 }}>
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          onClick={onConfirm}
          variant='primary'
          sx={{ flexBasis: 0, flexGrow: 1 }}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
