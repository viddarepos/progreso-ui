import { Avatar } from '@mui/material'
import { type MouseEvent, useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/store'
import { setAlert } from '../../features/alerts/alertsSlice'
import {
  selectIdsOfExistingProfilePics,
  selectProfilePictureData,
  selectProfilePictureError,
} from '../../features/profile/profileSelectors'
import { getProfilePicture } from '../../features/profile/profileSlice'
import { AlertType } from '../../utils/enums'
import { setDefaultAvatarImage } from '../../utils/functions'
import type { User } from '../../utils/interfaces'

type UserAvatarProps = {
  user: User | null
  openDropdownMenu?: (event: MouseEvent<HTMLDivElement | SVGElement>) => void
}

export default function UserAvatar({ user, openDropdownMenu }: UserAvatarProps) {
  const dispatch = useAppDispatch()
  const imgData = useAppSelector(selectProfilePictureData)
  const error = useAppSelector(selectProfilePictureError)
  const existingUserImgs = useAppSelector(selectIdsOfExistingProfilePics)
  const doesImageNeedToBeFetched = user && !existingUserImgs.includes(user?.id)
  const imgUrl = imgData.find((data) => data.userId === user?.id)?.url ?? ''

  useEffect(() => {
    if (user?.imagePath && doesImageNeedToBeFetched) {
      dispatch(getProfilePicture({ id: user.id, imagePath: user.imagePath }))
    }
  }, [user?.imagePath])

  useEffect(() => {
    if (error) {
      dispatch(
        setAlert({
          message: `Error retrieving profile picture for user: ${user?.fullName}`,
          type: AlertType.ERROR,
        })
      )
    }
  }, [error])

  if (!user) return null

  return (
    <Avatar
      alt="User's image"
      src={imgUrl ? imgUrl : undefined}
      onClick={openDropdownMenu}
      sx={{
        bgcolor: imgUrl ? 'transparent' : 'grey.400',
        color: imgUrl ? 'inherit' : 'text.primary',
        cursor: 'pointer',
      }}
    >
      {!imgUrl && setDefaultAvatarImage(user.fullName)}
    </Avatar>
  )
}
