import moment from 'moment'

export default function useDate () {
  const formatDate = (date: string, withTimeAgo: boolean = false): string => {
    let formattedDate = moment(date).format('MMMM DD, YYYY h:mm A')

    if (withTimeAgo) {
      formattedDate = moment(formattedDate).fromNow()
    }

    return formattedDate
  }

  const formatDateToApi = (date: string): string => {
    return new Date(moment(date).format('Y-MM-DD HH:mm:ss')).toUTCString()
  }

  const currentUtcTime = (): string => {
    return moment(new Date().toISOString()).format('Y-MM-DD HH:mm:ss')
  }

  const formatApiToWeb = (date: string): string => {
    return moment.utc(date).format('Y-MM-DD HH:mm:ss')
  }

  return {
    formatDate,
    formatDateToApi,
    currentUtcTime,
    formatApiToWeb
  }
}
