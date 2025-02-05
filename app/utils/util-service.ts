export const formatDateForTable = (dateTimeString: string) => {
  const date = new Date(dateTimeString)
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }
  return date.toLocaleDateString(undefined, options)
}
