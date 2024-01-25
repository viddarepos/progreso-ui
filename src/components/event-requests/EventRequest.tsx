import ApproveIcon from '@mui/icons-material/CheckCircleOutline'
import EditIcon from '@mui/icons-material/EditOutlined'
import MarkScheduledIcon from '@mui/icons-material/EventAvailable'
import RejectIcon from '@mui/icons-material/HighlightOff'
import type { SelectChangeEvent } from '@mui/material'
import { Button, IconButton, MenuItem, Select, Tooltip, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useEffect, useState } from 'react'

import { useAppSelector } from '../../app/store'
import { selectRequesters } from '../../features/requesters/requestersSelectors'
import { ModalType } from '../../pages/EventRequests'
import type { ModalData } from '../../pages/EventRequests'
import { EventRequestStatus, ModalActions, Role } from '../../utils/enums'
import type { EventRequest, Season, User } from '../../utils/interfaces'

type Props = {
  data: EventRequest
  isLast: boolean
  currentUser: User | null
  seasons: Season[] | null
  openModal: (args: ModalData) => void
  changeRequestAssignee: (args: {
    newAssigneeId: number
    requestId: number
    requestStatus: EventRequestStatus
  }) => void
}

const getStatusBackgroudColor = (status: string) => {
  switch (status) {
    case EventRequestStatus.APPROVED:
      return 'success.100'
    case EventRequestStatus.REQUESTED:
      return 'warning.100'
    case EventRequestStatus.REJECTED:
      return 'error.main'
    default:
      return 'primary.100'
  }
}

const getCurrentUserPermissions = ({
  currentUser,
  assigneeId,
  requesterId,
  status,
  seasonId,
}: {
  currentUser: User | null
  assigneeId: number | undefined
  requesterId: number
  status: EventRequestStatus
  seasonId: number
}) => {
  let isAdmin = false
  let isIntern = false
  let isMentor = false
  let canEdit = false
  let canSchedule = false
  let canApprove = false
  let canReassign = false

  switch (currentUser?.account.role) {
    case Role.ADMIN:
      isAdmin = true
      break
    case Role.MENTOR:
      isMentor = true
      break
    case Role.INTERN:
      isIntern = true
      break
  }
  if (isAdmin) {
    canEdit = true
    if (status === EventRequestStatus.REQUESTED) {
      canApprove = true
    } else if (status === EventRequestStatus.APPROVED) {
      canReassign = true
      if (assigneeId) {
        canSchedule = true
      }
    }
  } else if (isMentor) {
    if (currentUser?.seasons.map((season) => season.id).includes(seasonId)) {
      canEdit = true
    }
    if (currentUser?.id === assigneeId && status === EventRequestStatus.APPROVED) {
      canSchedule = true
    }
  } else if (isIntern && currentUser?.id === requesterId) {
    canEdit = true
  }

  return { canApprove, canEdit, canReassign, canSchedule }
}

const getSeasonData = (seasons: Season[] | null, seasonId: number) => {
  const seasonData = seasons?.reduce(
    (acc, season) => {
      if (season.id === seasonId) {
        acc.seasonName = season.name
        acc.seasonMentors = season.mentors
      }
      return acc
    },
    { seasonMentors: [], seasonName: '' } as { seasonName: string; seasonMentors: User[] }
  )
  return seasonData ?? { seasonMentors: [], seasonName: '' }
}

const textContainerStyle = {
  alignItems: { mobile: 'start', tablet: 'center' },
  display: 'flex',
  flexDirection: {
    mobile: 'column',
    tablet: 'row',
  },
  flexWrap: 'wrap',
  gap: {
    mobile: '0',
    tablet: '0.5rem',
  },
  paddingY: {
    mobile: '0.5rem',
    tablet: '0',
  },
}

export default function EventRequest({
  data,
  isLast,
  currentUser,
  seasons,
  openModal,
  changeRequestAssignee,
}: Props) {
  const [showMore, setShowMore] = useState(false)
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<number | string>('')
  const { id, title, description, requesterId, assigneeId, status, seasonId } = data
  const { seasonName, seasonMentors } = getSeasonData(seasons, seasonId)
  const { canApprove, canEdit, canSchedule, canReassign } = getCurrentUserPermissions({
    assigneeId,
    currentUser,
    requesterId,
    seasonId,
    status,
  })
  const allRequesters = useAppSelector(selectRequesters)
  const requester = allRequesters && allRequesters?.find((user) => user.id === requesterId)
  const assignee = seasonMentors.find((mentor) => mentor.id === assigneeId)

  useEffect(() => {
    if (assigneeId) {
      setSelectedAssigneeId(assigneeId)
    }
  }, [assigneeId])

  const handleMarkAsScheduledClick = () => {
    openModal({ requestId: id, type: ModalType.CONFIRMATION })
  }

  const handleApproveClick = () => {
    openModal({
      action: ModalActions.APPROVE,
      requestId: id,
      seasonMentors,
      type: ModalType.APPROVAL,
    })
  }

  const handleRejectClick = () => {
    openModal({ action: ModalActions.REJECT, requestId: id, type: ModalType.REJECTION })
  }

  const handleEditClick = () => {
    openModal({ requestId: id, type: ModalType.EDITING })
  }

  const toggleShowMoreText = () => setShowMore((prev) => !prev)

  const handleChangeAssigee = (event: SelectChangeEvent<number | string>) => {
    const newAssigneeId = event.target.value as number
    setSelectedAssigneeId(newAssigneeId)
    changeRequestAssignee({ newAssigneeId, requestId: id, requestStatus: status })
  }

  const renderSelectedAssignee = (selectedId: number | string) => {
    if (!selectedId) return 'Choose assignee'
    return seasonMentors?.find((mentor) => mentor.id === selectedId)?.fullName
  }

  return (
    <Box
      sx={{
        borderBottom: '1px solid',
        borderColor: isLast ? 'black' : 'grey.400',
        display: 'grid',
        gridTemplateColumns: { desktop: '1fr 250px', mobile: '1fr 120px' },
        gridTemplateRows: 'repeat(3, max-content)',
        paddingY: '1rem',
      }}
    >
      <Box>
        <Typography fontSize={'1.3rem'} fontWeight={700}>
          {title}
        </Typography>
        <Typography variant='subtitle2' sx={{ color: 'grey.700' }}>
          {seasonName}
        </Typography>
      </Box>
      <Typography
        component='div'
        variant='button'
        sx={{
          alignSelf: 'start',
          backgroundColor: getStatusBackgroudColor(status),
          borderRadius: '13px',
          justifySelf: 'end',
          padding: '0.2rem 1.6rem',
        }}
      >
        {status}
      </Typography>
      <Typography paddingY={'0.5rem'} gridColumn={'1/-1'} textAlign='justify'>
        {description.length > 200 ? (
          <>
            {showMore ? description : `${description.substring(0, 200)}...`}
            <Button variant='xs' onClick={toggleShowMoreText}>
              {showMore ? 'Show less' : 'Show more'}
            </Button>
          </>
        ) : (
          description
        )}
      </Typography>
      <Box
        sx={{
          alignSelf: 'end',
          display: 'grid',
          gridTemplateColumns: { mobile: '1fr', tablet: 'repeat(2, 1fr)' },
        }}
      >
        <Box sx={textContainerStyle}>
          <Typography color='grey.700' fontWeight={600}>
            Requester:{' '}
          </Typography>
          <Typography>{requester?.requestor.fullName}</Typography>
        </Box>
        <Box sx={textContainerStyle}>
          <Typography color='grey.700' fontWeight={600}>
            Assignee:{' '}
          </Typography>
          {canReassign && seasonMentors.length > 0 ? (
            <Select
              onChange={handleChangeAssigee}
              variant='standard'
              sx={{
                '&.MuiInputBase-root': {
                  margin: 0,
                  marginTop: {
                    mobile: '0.3rem',
                    tabloet: '0',
                  },
                },
                minWidth: '150px',
              }}
              value={selectedAssigneeId}
              renderValue={renderSelectedAssignee}
              displayEmpty
            >
              {seasonMentors.map((mentor) => (
                <MenuItem key={mentor.id} value={mentor.id}>
                  {mentor.fullName}
                </MenuItem>
              ))}
            </Select>
          ) : (
            <Typography>{assignee?.fullName ?? '(pending)'}</Typography>
          )}
        </Box>
      </Box>
      <Box alignSelf={'end'} justifySelf={'end'}>
        {canEdit && (
          <Tooltip title='Edit'>
            <IconButton onClick={handleEditClick}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        {canApprove && (
          <>
            <Tooltip title='Approve'>
              <IconButton onClick={handleApproveClick}>
                <ApproveIcon sx={{ color: 'success.main' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title='Reject'>
              <IconButton onClick={handleRejectClick}>
                <RejectIcon sx={{ color: 'error.dark' }} />
              </IconButton>
            </Tooltip>
          </>
        )}
        {canSchedule && (
          <Tooltip title='Mark as scheduled'>
            <IconButton onClick={handleMarkAsScheduledClick}>
              <MarkScheduledIcon sx={{ color: 'primary.main' }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  )
}
