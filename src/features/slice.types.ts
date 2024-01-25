import type { SerializedError } from '@reduxjs/toolkit'

import type {
  AbsenceStatus,
  AbsenceType,
  AlertType,
  EventRequestStatus,
  EventsSliceActionTypePrefix,
  RequestsSliceActionTypePrefix,
  TechnologiesSliceActionTypePrefix,
  UserModalActions,
} from '../utils/enums'
import type {
  Absence,
  CalendarAbsence,
  CalendarEvent,
  CountryData,
  Event,
  EventRequest,
  GatewayApiError,
  Requester,
  Season,
  SerializedErrorWithType,
  Technology,
  User,
} from '../utils/interfaces'

export type InitialState = {
  error: SerializedError | null
  isLoading: boolean
}

export type SeasonsInitialState = InitialState & {
  id: number | null
  seasons: Season[]
  season: Season | null
  isDeleted: boolean
  openDeleteModal: boolean
  pageSize: number
  totalPages: number
  pageNumber: number
}

export type UsersInitialState = InitialState & {
  error: SerializedError | GatewayApiError | null
  isDeleted: boolean
  isArchived: boolean
  isPasswordChanged: boolean
  isSuccess: boolean
  isLoading: boolean
  isLoadingUser: boolean
  user: User | null
  userError: SerializedError | null
  users: User[]
  actionErrors: GatewayApiError | null
  pageNumber: number
  totalPages: number
  pageSize: number
}

export type AuthInitialState = InitialState & {
  error: SerializedError | GatewayApiError | null
  isLoading: boolean
  isLoggedIn: boolean
}

export type EventsInitialState = {
  loadingType: EventsSliceActionTypePrefix | null
  error: SerializedErrorWithType | null
  event: Event | null
  events: CalendarEvent[] | null
  successType: string | null
}

export type RequestsInitialState = {
  loadingType: RequestsSliceActionTypePrefix | null
  error: SerializedErrorWithType | null
  requests: EventRequest[] | null
  request: EventRequest | null
  successType: string | null
  pagination: Pagination
}

export type ProfileInitialState = InitialState & {
  currentUser: User | null
  isUserAdmin: boolean
  isSuccess: boolean
  imageData: { url: string; userId: number }[]
  imageError: SerializedError | null
}

export type CreateAndEditUserData = InitialState & {
  account: {
    email: string
    id?: number
    role: string
  }
  fullName: string
  dateOfBirth: string
  phoneNumber: string
  location: string
  technologies: string[]
  image: File | undefined
}

export type CreateAndEditUserDataForm = InitialState & {
  account: {
    email: string
    id?: number
    role: string
  }
  fullName: string
  dateOfBirth: string
  phoneNumber: string
  location: {
    country: string
    city: string
  }
  technologies: string[]
  image: File | undefined
}

export type TechnologiesInitialState = {
  loadingType: TechnologiesSliceActionTypePrefix | null
  error: SerializedErrorWithType | (GatewayApiError & { type: string }) | null
  technology: Technology | null
  technologies: Technology[] | null
  technologiesByPage: Technology[] | null
  successType: TechnologiesSliceActionTypePrefix | null
  pagination: Pagination
}

export type LocationInitialState = InitialState & {
  error: SerializedError | null
  locations: CountryData[] | null
  isLoading: boolean
  isSuccess: boolean
}

export type AbsenceInitialState = {
  error: SerializedErrorWithType | null
  absences: Absence[] | null
  absence: Absence | null
  calendarAbsences: CalendarAbsence[] | null
  successType: string | null
  loadingType: string | null
  pagination: Pagination
}

export type RequestersInitialState = InitialState & {
  error: SerializedErrorWithType | null
  isLoading: boolean
  requesters: Requester[]
}

export type AlertInitialState = {
  alerts: AlertData[]
}

export type AlertData = {
  id: string
  type: AlertType | null
  message: string | null
}

export type FilterCriteria = {
  page?: number
  size?: number
  sort?: string
}

export type RequestsFilterCriteria = FilterCriteria & {
  status?: EventRequestStatus
  seasonId?: string
}

export type AbsencesFilterCriteria = FilterCriteria & {
  status?: AbsenceStatus
  seasonId?: string
  absenceType?: AbsenceType
}

export type RequestChangeStatusData = {
  id: number
  status: EventRequestStatus
  assignee?: number
  comment: string
}

export type Pagination = {
  totalPages: number
  pageNumber: number
}

export type ResponseWithPagebleContent<T> = {
  content: T[]
  totalElements: number
  totalPages: number
  last: boolean
  size: number
  number: number
  sort: {
    empty: boolean
    sorted: boolean
    unsorted: boolean
  }
  numberOfElements: number
  first: boolean
  empty: boolean
}

export type UserActionsModalData = {
  action: UserModalActions | null
  user?: User | null
}
