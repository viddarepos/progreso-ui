import type { SerializedError } from '@reduxjs/toolkit'

import type {
  AbsenceStatus,
  AbsenceType,
  DurationType,
  EventRequestStatus,
  Role,
  Status,
} from './enums'

export interface UserAccount {
  id: number
  email: string
  role: Role
  status: Status
}
export interface Technology {
  id: number
  name: string
}

export interface UserSeasons {
  id: number
  name: string
}

export interface User {
  id: number
  fullName: string
  dateOfBirth: string
  phoneNumber: string
  location: string
  technologies?: Technology[]
  imagePath?: string | null
  account: UserAccount
  integrations: string[]
  seasons: UserSeasons[]
}

export interface Location {
  city: string
  country: string
}

export interface FilterUser {
  fullName?: string
  location?: string
  role?: string
  page?: number
  size?: number
}

export interface SeasonPagination {
  page?: number
  size?: number
}

export interface FilterUserData {
  filterName?: string
  filterLocation?: string
  filterRole?: string
}

export interface LoginFormData {
  email: string
  password: string
}
export interface DecodedToken {
  userId: number
  sub: string //email
  iat: number
  exp: number
}

export interface GatewayApiError {
  type: string
  title: string
  status: number
  detail: string
  instance: string
  violations?: GatewayApiErrorViolationsObject | GatewayApiErrorViolationsObject[]
}

export interface GatewayApiErrorViolationsObject {
  error: string
  field: string | null
  timestamp: string
}

export interface SerializedErrorWithType extends SerializedError {
  type: string
}

export interface EventData {
  title: string
  description?: string
  startTime: string
  duration: string
  seasonId: string
  optionalAttendees: number[]
  requiredAttendees: number[]
}

export interface Attendee {
  id: number
  fullName: string
  email: string
  required: boolean
}

export interface Event {
  id: number
  title: string
  description: string
  startTime: Date
  duration: number
  creatorId: number
  seasonId: number
  attendees: Attendee[]
}

export interface CountryData {
  iso2: string
  iso3: string
  country: string
  cities: string[]
}
export interface LocationResponseData {
  error: boolean
  msg: string
  data: CountryData[]
}
export interface CalendarEvent {
  id: number
  title: string
  duration: number
  startTime: string
}

export interface Season {
  id: number
  name: string
  durationValue: number
  durationType: DurationType
  startDate: string
  endDate: string
  technologies: Technology[]
  mentors: User[]
  interns: User[]
  owner: User
}
export interface EventRequestData {
  id?: number
  title: string
  description: string
  seasonId: number
}

export interface EventRequest {
  id: number
  title: string
  description: string
  status: EventRequestStatus
  requesterId: number
  assigneeId?: number
  seasonId: number
}

export interface Requester {
  id: number
  requestor: User
}

export interface Absence {
  id: number
  title: string
  description: string
  status: AbsenceStatus
  requesterId: number
  absenceType: AbsenceType
  startTime: Date
  endTime: Date
  seasonId: number
}

export interface AbsenceData {
  title?: string
  description?: string
  absenceType?: AbsenceType
  startTime?: string
  endTime?: string
  seasonId?: string | undefined
}

export interface CalendarAbsence {
  id: string
  displayName: string
  status: AbsenceStatus
  absenceType: AbsenceType
  startTime: string
  endTime: string
}

export interface CalendarFilterData {
  startDate: string
  endDate: string
  absenceType?: string
  status?: string
}
