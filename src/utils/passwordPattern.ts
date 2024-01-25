export const fullPasswordPattern =
  /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/])[A-Za-z\d~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/]{8,}/

const lengthPattern = /[A-Za-z\d~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/]{8,}/
const charPattern = /[~`! @#$%^&*()_\-+={[}\]|:;"'<,>.?/]/
const uppercasePattern = /[A-Z]{1,}/
const lowercasePattern = /[a-z]{1,}/
const numberPattern = /\d{1,}/

export function getPasswordPatternErrorMessage(password: string): string {
  let errorMessage = 'Password must contain at least'
  if (!lengthPattern.test(password)) {
    errorMessage += ' 8 chararters'
  } else if (!uppercasePattern.test(password)) {
    errorMessage += ' one uppercase letter'
  } else if (!lowercasePattern.test(password)) {
    errorMessage += ' one lowercase letter'
  } else if (!numberPattern.test(password)) {
    errorMessage += ' one number'
  } else if (!charPattern.test(password)) {
    errorMessage += ' one special character'
  }
  return errorMessage
}
