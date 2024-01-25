import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import jwtDecode from 'jwt-decode'
import capitalize from 'lodash/capitalize'
import upperFirst from 'lodash/upperFirst'

import { STORAGE_ACCESS_TOKEN_KEY } from './constants'
import type { DecodedToken } from './interfaces'

dayjs.extend(duration)

export const setDefaultAvatarImage = (fullName: string) => {
  const userName = fullName.trim().split(' ')
  const firstName = userName[0][0]?.toUpperCase()
  const lastName = userName[1]?.[0]?.toUpperCase()
  const avatarName = (firstName ?? '') + (lastName ?? '')

  return avatarName
}

export const getTokenFromLocalStorage = () => {
  return localStorage.getItem(STORAGE_ACCESS_TOKEN_KEY)
}

export const getDecodedTokenData = () => {
  const token = getTokenFromLocalStorage()
  if (token) {
    return jwtDecode(token) as DecodedToken
  }
}

export const getAuthorizationHeader = () => {
  const token = getTokenFromLocalStorage()
  if (token) {
    return `Bearer ${token}`
  }
}

export const getFormatedDateString = (date: Date) => {
  return dayjs(date).format('YYYY-MM-DD')
}

export const getEventDuration: (args: { startTime: string; duration: number }) => Dayjs = ({
  startTime,
  duration,
}) => {
  return dayjs(startTime).add(duration, 'm')
}

export const getEventDurationInMin = (duration: string) => {
  const hours = Number(duration.split(':')[0])
  const minutes = Number(duration.split(':')[1])
  return (hours * 60 + minutes).toString()
}

export const getEventDurationString = (minutes: number) => {
  const duration = dayjs.duration(minutes, 'm')
  return duration.format('HH:mm')
}

export const updateEventDurationString = (startTime: Dayjs, endTime: Dayjs) => {
  const diff = endTime.diff(startTime, 'm', true)
  if (diff > 0) {
    return getEventDurationString(diff)
  }
  return '00:00'
}

export const getEventTime = (eventTime: Dayjs) => {
  return dayjs(eventTime).format('YYYY-MM-DD HH:mm')
}

export const getEventInfoStartTime = (startTime: Date) => {
  return dayjs(startTime).format('dddd, MMMM D - HH:mm')
}

export const getEventInfoDuration = (minutes: number) => {
  const duration = dayjs.duration(minutes, 'm')
  return minutes < 60
    ? duration.format('m [min]')
    : minutes % 60
    ? duration.format('H [h], m [min]')
    : duration.format('H [h]')
}

export const roundToNearest30Min = (date: Dayjs) => {
  const minutes = 30
  const ms = 1000 * 60 * minutes
  return dayjs(Math.round(dayjs(date).valueOf() / ms) * ms)
}

export const getFormattedEventTime = (date?: Date, isCreateModal?: boolean) => {
  if (!date) {
    return roundToNearest30Min(dayjs()).add(1, 'h')
  }
  if (dayjs(date).hour() === 0 && isCreateModal) {
    return dayjs(date).add(8, 'h')
  }
  return dayjs(date)
}

export const formatSeasonDuration = (durationValue: number, durationType: string) => {
  const formatDurationType = upperFirst(durationType.toLowerCase())

  return durationValue === 1
    ? `${durationValue} ${formatDurationType.slice(0, -1)}`
    : `${durationValue} ${formatDurationType}`
}

export const setCapitalizedWord = (word: string) => capitalize(word)

export const setCapitalizedAbsenceType = (word: string) => {
  const [firstWord, secondWord] = word.toLowerCase().split('_')
  return `${upperFirst(firstWord)} ${upperFirst(secondWord)}`
}
