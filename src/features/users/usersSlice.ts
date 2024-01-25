import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { AxiosResponse } from 'axios'

import { api } from '../../utils/axios.config'
import { UsersSliceActionTypePrefix } from '../../utils/enums'
import type { FilterUser, GatewayApiError } from '../../utils/interfaces'
import type { CreateAndEditUserData, UsersInitialState } from '../slice.types'

const {
  USERS_GET_ALL,
  USERS_CREATE,
  USERS_UPDATE,
  USERS_GET_ONE,
  USERS_DELETE,
  USERS_CHANGE_PASSWORD,
  USERS_ARCHIVE,
} = UsersSliceActionTypePrefix

const initialState: UsersInitialState = {
  actionErrors: null,
  error: null,
  isArchived: false,
  isDeleted: false,
  isLoading: false,
  isLoadingUser: false,
  isPasswordChanged: false,
  isSuccess: false,
  pageNumber: 0,
  pageSize: 10,
  totalPages: 0,
  user: null,
  userError: null,
  users: [],
}

export const getAllUsers = createAsyncThunk(USERS_GET_ALL, async (filterCriteria?: FilterUser) => {
  filterCriteria = filterCriteria || {}

  const response = await api.get('/users', {
    params: filterCriteria,
  })

  return response?.data
})

export const getUserById = createAsyncThunk(USERS_GET_ONE, async (userId: number | string) => {
  const response = await api.get(`/users/${userId}`)
  return response?.data
})

export const deleteUser = createAsyncThunk(
  USERS_DELETE,
  async ({ userId }: { userId: number }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/users/${userId}`)
      return response?.data
    } catch (error: any) {
      if (error?.response) {
        return rejectWithValue(error.response.data.detail)
      }
      throw new Error(error)
    }
  }
)

export const archiveUser = createAsyncThunk<void, number>(USERS_ARCHIVE, async (userId) => {
  const response = await api.patch(`/users/${userId}/archive`)
  return response?.data
})

export const changePassword = createAsyncThunk<
  AxiosResponse,
  { userId: number; oldPassword: string; newPassword: string },
  { rejectValue: GatewayApiError }
>(USERS_CHANGE_PASSWORD, async ({ userId, oldPassword, newPassword }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`users/${userId}/password`, { newPassword, oldPassword })
    return response?.data
  } catch (error: any) {
    if (error?.response) {
      return rejectWithValue(error.response.data)
    }
    throw new Error(error)
  }
})

export const createUser = createAsyncThunk<
  AxiosResponse,
  { user: CreateAndEditUserData },
  { rejectValue: GatewayApiError }
>(USERS_CREATE, async ({ user }, { rejectWithValue }) => {
  try {
    const response = await api.post('users', user)
    return response?.data
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data)
    }
    throw new Error(error)
  }
})

export const editUser = createAsyncThunk<
  AxiosResponse,
  { user: CreateAndEditUserData; file: File | undefined },
  { rejectValue: GatewayApiError }
>(USERS_UPDATE, async ({ user, file }, { rejectWithValue }) => {
  const formData = new FormData()
  formData.append('user', JSON.stringify(user))

  if (file) {
    formData.append('file', file)
  }

  try {
    const response = await api.patch(`users/${user.account.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response?.data
  } catch (error: any) {
    if (error.response) {
      return rejectWithValue(error.response.data)
    }
    throw new Error(error)
  }
})

const usersSlice = createSlice({
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoadingUser = true
        state.error = null
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.pageSize = action.payload.size
        state.totalPages = action.payload.totalPages
        state.isLoadingUser = false
        state.users = action.payload.content

        if (state.users.length === 0 && state.totalPages) {
          state.pageNumber = state.totalPages - 1
        } else {
          state.pageNumber = action.payload.number
        }
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoadingUser = false
      })
      .addCase(getUserById.pending, (state) => {
        state.isLoadingUser = true
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoadingUser = false
        state.user = action.payload
      })
      .addCase(getUserById.rejected, (state) => {
        state.isLoadingUser = false
      })
      .addCase(deleteUser.pending, (state) => {
        state.isLoading = true
        state.userError = null
        state.isDeleted = false
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.isLoading = false
        state.isDeleted = true
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false
        state.userError = action.payload ?? action.error
      })
      .addCase(archiveUser.pending, (state) => {
        state.isLoading = true
        state.userError = null
        state.isArchived = false
      })
      .addCase(archiveUser.fulfilled, (state) => {
        state.isLoading = false
        state.isArchived = true
      })
      .addCase(archiveUser.rejected, (state, action) => {
        state.isLoading = false
        state.userError = action.error
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true
        state.isPasswordChanged = false
        state.error = null
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false
        state.isPasswordChanged = true
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload ?? action.error
      })
      .addCase(createUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.actionErrors = null
      })
      .addCase(createUser.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(createUser.rejected, (state, action) => {
        state.isLoading = false
        state.actionErrors = action.payload || null
      })
      .addCase(editUser.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.actionErrors = null
      })
      .addCase(editUser.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(editUser.rejected, (state, action) => {
        state.isLoading = false
        state.actionErrors = action.payload || null
      })
  },
  initialState,
  name: 'users',
  reducers: {
    changePage: (state, action) => {
      state.pageNumber = action.payload
    },
    changePageSize: (state, action) => {
      state.pageSize = action.payload
    },
    changeToFirstPage: (state) => {
      state.pageNumber = 0
    },
    clearError: (state) => {
      state.error = null
    },
    clearIsArchived: (state) => {
      state.isArchived = false
    },
    clearIsDeleted: (state) => {
      state.isDeleted = false
    },
    clearIsPasswordChanged: (state) => {
      state.isPasswordChanged = false
    },
    clearIsSuccess: (state) => {
      state.isSuccess = false
    },
    clearUserActionErrors: (state) => {
      state.actionErrors = null
    },
    clearUserError: (state) => {
      state.userError = null
    },
  },
})

export const {
  clearIsPasswordChanged,
  clearIsSuccess,
  clearError,
  clearUserActionErrors,
  clearIsDeleted,
  clearUserError,
  changePage,
  changePageSize,
  changeToFirstPage,
  clearIsArchived,
} = usersSlice.actions
export default usersSlice.reducer
