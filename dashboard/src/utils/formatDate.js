import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ar'

dayjs.extend(relativeTime)

export function formatDate(date, format = 'DD/MM/YYYY') {
  if (!date) return ''
  return dayjs(date).format(format)
}

export function formatDateISO(date) {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

export function formatDateTime(date) {
  if (!date) return ''
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

export function fromNow(date, locale = 'ar') {
  if (!date) return ''
  return dayjs(date).locale(locale).fromNow()
}

export function isValidDate(date) {
  return dayjs(date).isValid()
}
