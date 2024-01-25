import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

type InfoModal = {
  open: boolean
  onClose: () => void
  title: string
  content: string
}

export default function InfoModal({ open, onClose, title, content }: InfoModal) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiPaper-root': {
          padding: '1rem 2rem',
        },
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
          margin: '1.5rem 0',
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
        <Button onClick={onClose} variant='outlined'>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}
