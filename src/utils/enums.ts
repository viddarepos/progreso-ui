export enum RoutePaths {
  INDEX = '/',
  LOGIN = '/login',
  CALENDAR = '/calendar',
  USERS = '/users',
  PROFILE = '/profile',
  SEASONS = '/seasons',
  EVENT_REQUESTS = '/event-requests',
  ABSENCE_TRACKING = '/absence-tracking',
  TECHNOLOGIES = '/technologies',
}

export enum Role {
  ADMIN = 'ADMIN',
  MENTOR = 'MENTOR',
  INTERN = 'INTERN',
}

export enum Status {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

export enum DurationType {
  MONTHS = 'MONTHS',
  WEEKS = 'WEEKS',
}

export enum InputValidationMessages {
  REQUIRED = 'This field is required',
  CHOOSE_ONE = 'Choose at least 1 ',
  MIN_LENGTH = 'This field must have at least ',
  MAX_LENGTH = 'This field must have less than ',
  VALID_EMAIL = 'Please enter a valid email address',
  VALID_TIME = 'Please enter a valid time',
  VALID_DATE = 'Please enter a valid date',
  VALID_END_TIME = 'End time cannot be before start time',
  MIN_DURATION = 'Duration of the event has to be at least ',
}

export enum AlertSuccessMessages {
  USERS_CREATE = 'User was created',
  USERS_EDIT = 'Profile was updated',
  USERS_DELETE = 'User was deleted',
  USERS_CHANGE_PASSWORD = 'Password was changed',
  USERS_ARCHIVE = "User's profile was archived",

  EVENTS_CREATE = 'Event created',
  EVENTS_EDIT = 'Event was updated',
  EVENTS_DELETE = 'Event was deleted',

  REQUESTS_CREATE = 'Event request created',
  REQUESTS_CHANGE_STATUS = 'Request updated',
  REQUESTS_EDIT = 'Request was updated',

  SEASONS_DELETE = 'Season was deleted',

  TECHNOLOGIES_CREATE = 'Technology created',
  TECHNOLOGIES_EDIT = 'Technology updated',
  TECHNOLOGIES_DELETE = 'Technology deleted',

  ABSENCES_DELETE = 'Absence was deleted',
}

export enum AlertErrorMessages {
  USERS_CREATE = "User couldn't be created",
  USERS_EDIT = "Profile couldn't be updated",
  USERS_DELETE = "User couldn't be deleted",
  USERS_CHANGE_PASSWORD = "Password couldn't be changed",
  USERS_ARCHIVE = "User doesn't exist or has already been archived",

  EVENTS_CREATE = "Event couldn't be created",
  EVENTS_EDIT = "Event couldn't be updated",
  EVENTS_DELETE = "Event couldn't be deleted",
  EVENTS_GET_ALL = "Events couldn't be displayed",
  EVENTS_GET_ONE = "Event details couldn't be displayed",

  REQUESTS_CREATE = "Event request couldn't be created",
  REQUESTS_CHANGE_STATUS = "Request couldn't be updated",
  REQUESTS_GET_ALL = "Request's couldn't be displayed",
  REQUESTS_EDIT = "Request couldn't be updated",

  SEASONS_DELETE = "Season couldn't be deleted",

  TECHNOLOGIES_CREATE = "Technology couldn't be created",
  TECHNOLOGIES_EDIT = "Technology couldn't be updated",
  TECHNOLOGIES_DELETE = "Technology could't be deleted",
  TECHNOLOGIES_GET_ONE_PAGE = "Technologies couldn't be displayed",

  ABSENCES_GET_ALL = "Absences couldn't be displayed",
  ABSENCES_CREATE = "Absence couldn't be created",
  ABSENCES_EDIT = "Absence couldn't be updated",
  ABSENCES_DELETE = "Absence couldn't be deleted",
}

export enum UsersSliceActionTypePrefix {
  USERS_CREATE = 'users/create',
  USERS_GET_ALL = 'users/getAll',
  USERS_GET_ONE = 'users/getById',
  USERS_UPDATE = 'users/update',
  USERS_DELETE = 'users/delete',
  USERS_CHANGE_PASSWORD = 'users/changePassword',
  USERS_ARCHIVE = 'users/archive',
}

export enum EventsSliceActionTypePrefix {
  EVENTS_CREATE = 'events/create',
  EVENTS_GET_ALL = 'events/getAll',
  EVENTS_GET_ONE = 'events/getById',
  EVENTS_DELETE = 'events/delete',
  EVENTS_EDIT = 'events/edit',
}

export enum RequestsSliceActionTypePrefix {
  REQUESTS_GET_ALL = 'events/requests/getAll',
  REQUESTS_GET_ONE = 'events/requests/getById',
  REQUESTS_CREATE = 'events/requests/create',
  REQUESTS_CHANGE_STATUS = 'events/requests/changeStatus',
  REQUESTS_EDIT = 'events/requests/edit',
}

export enum TechnologiesSliceActionTypePrefix {
  TECHNOLOGIES_GET_ALL = 'technologies/getAll',
  TECHNOLOGIES_GET_ONE_PAGE = 'technologies/getAllByPage',
  TECHNOLOGIES_GET_ONE = 'technologies/getById',
  TECHNOLOGIES_CREATE = 'technologies/create',
  TECHNOLOGIES_EDIT = 'technologies/edit',
  TECHNOLOGIES_DELETE = 'technologies/delete',
}

export enum AbsenceSliceActionTypePrefix {
  ABSENCE_CREATE = 'absences/create',
  ABSENCE_GET_ALL = 'absences/getAll',
  ABSENCE_GET_CALENDAR = 'absences/getCalendar',
  ABSENCE_GET_ONE = 'absences/getById',
  ABSENCE_UPDATE = 'absences/update',
  ABSENCE_DELETE = 'absences/delete',
}

export enum RequestersSliceActionTypePrefix {
  REQUESTERS_GET_ALL = 'users/getMultipleById',
}

export enum ActionsForUserModalForm {
  EDIT = 'edit',
  CREATE = 'create',
}

export enum UserModalActions {
  EDIT = 'EDIT',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  ARCHIVE = 'ARCHIVE',
}

export enum LocationType {
  COUNTRIES = 'countries',
}

export enum AlertType {
  INFO = 'info',
  ERROR = 'error',
  SUCCESS = 'success',
}

export enum EventRequestStatus {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SCHEDULED = 'SCHEDULED',
}

export enum AbsenceStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum AbsenceType {
  TIME_OFF = 'TIME_OFF',
  SICK_LEAVE = 'SICK_LEAVE',
}

export enum SeasonsSliceActionTypePrefix {
  SEASONS_GET_ALL = 'seasons/getAll',
  SEASONS_DELETE = 'seasons/delete',
  SEASONS_GET_ONE = 'seasons/getById',
}

export enum ModalActions {
  EDIT = 'EDIT',
  CREATE = 'CREATE',
  DELETE = 'DELETE',
  CONFIRM = 'CONFIRM',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

export enum CalendarEventSources {
  SCHEDULED_EVENTS = 'scheduledEvents',
  APPROVED_TIME_OFFS = 'approvedTimeOffs',
  PENDING_TIME_OFFS = 'pendingTimeOffs',
  APPROVED_SICK_LEAVES = 'approvedSickLeaves',
  PENDING_SICK_LEAVES = 'pendingSickLeaves',
}
