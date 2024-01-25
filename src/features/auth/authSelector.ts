import type { RootState } from '../../app/store'

const authSelector = (state: RootState) => state.auth

export const selectUsersIsLoggedIn = (state: RootState) => authSelector(state).isLoggedIn

export const selectLoginError = (state: RootState) => authSelector(state).error
