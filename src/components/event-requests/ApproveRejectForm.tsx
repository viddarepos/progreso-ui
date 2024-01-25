import { yupResolver } from '@hookform/resolvers/yup'
import type { SelectChangeEvent } from '@mui/material'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'

import { InputValidationMessages, ModalActions } from '../../utils/enums'
import type { User } from '../../utils/interfaces'

type Props = {
  onClose: () => void
  onConfirm: (action: ModalActions, formData: { comment: string; assignee?: number }) => void
  action: ModalActions | undefined
  mentors?: User[]
  isLoading: boolean
}

type FormData = {
  assignee?: number | string
  comment: string
}

const schema = yup.object({
  comment: yup.string().required(InputValidationMessages.REQUIRED),
})

export default function ApproveRejectForm({
  action,
  onClose,
  onConfirm,
  mentors,
  isLoading,
}: Props) {
  const title = action === ModalActions.APPROVE ? 'Approve request?' : 'Reject request?'
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      assignee: '',
      comment: '',
    },
    resolver: yupResolver(schema as yup.ObjectSchema<FormData>),
  })

  const handleConfirm = (data: FormData) => {
    action && onConfirm(action, data as { comment: string; assignee?: number })
    reset()
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  if (!action) return
  return (
    <Dialog
      open={true}
      onClose={handleClose}
      sx={{
        '& .MuiPaper-root': {
          maxWidth: '100svw',
          padding: '1rem 2rem',
          width: '400px',
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
          marginBottom: '1.5rem',
          padding: ' 0 0 2rem 0',
        }}
      >
        <Box component='form' onSubmit={handleSubmit(handleConfirm)} id='approveOrReject'>
          <InputLabel required>Comment</InputLabel>
          <Controller
            name='comment'
            control={control}
            render={({ field }) => (
              <OutlinedInput {...field} variant='wide' minRows={2} multiline />
            )}
          />
          <FormHelperText>{errors.comment?.message}</FormHelperText>
          {action === ModalActions.APPROVE && (
            <>
              <InputLabel>Assignee</InputLabel>
              <Controller
                name='assignee'
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    input={<OutlinedInput {...field} variant='wide' />}
                    onChange={(event: SelectChangeEvent<number | string>) =>
                      field.onChange(event.target.value as number)
                    }
                  >
                    <MenuItem value='' sx={{ color: 'grey.500', fontStyle: 'italic' }}>
                      No assignee
                    </MenuItem>
                    {mentors?.map((mentor) => (
                      <MenuItem key={mentor.id} value={mentor.id}>
                        {mentor.fullName}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.assignee?.message}</FormHelperText>
            </>
          )}
        </Box>
      </DialogContent>
      <DialogActions
        sx={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
        }}
      >
        <Button onClick={handleClose} variant='outlined' sx={{ flexBasis: 0, flexGrow: 1 }}>
          Cancel
        </Button>
        <Button
          type='submit'
          form='approveOrReject'
          variant='primary'
          disabled={isLoading}
          sx={{ flexBasis: 0, flexGrow: 1 }}
        >
          {action}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
