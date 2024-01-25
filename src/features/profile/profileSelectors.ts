import type { RootState } from '../../app/store'

const profileSelector = (state: RootState) => state.profile

export const selectProfileIsLoading = (state: RootState) => profileSelector(state).isLoading

export const selectProfileIsSuccess = (state: RootState) => profileSelector(state).isSuccess

export const selectProfileError = (state: RootState) => profileSelector(state).error

export const selectCurrentUserProfile = (state: RootState) => profileSelector(state).currentUser

export const selectIsCurrentUserAdmin = (state: RootState) => profileSelector(state).isUserAdmin

export const selectProfilePictureData = (state: RootState) => profileSelector(state).imageData

export const selectIdsOfExistingProfilePics = (state: RootState) =>
  profileSelector(state).imageData.map((data) => data.userId)

export const selectProfilePictureError = (state: RootState) => profileSelector(state).imageError
