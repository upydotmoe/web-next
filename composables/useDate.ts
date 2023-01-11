import moment from 'moment'

export default function useDate() {
  const formatDate = (date: string, withTimeAgo = false, withTime = true): string => {
    let formattedDate

    if (withTime) {
      formattedDate = moment(date).format('MMMM DD, YYYY h:mm A')
    } else {
      formattedDate = moment(date).format('MMMM DD, YYYY')
    }

    // apply time ago
    if (withTimeAgo) {
      formattedDate = moment(formattedDate).fromNow()
    }

    return formattedDate
  }

  const formatDateToApi = (date: string): string => {
    const utcDate = new Date(moment(date).format('Y-MM-DD HH:mm:ss')).toUTCString()
    console.log([date, utcDate])
    return utcDate
  }

  const currentUtcTime = (): string => {
    return moment().utc().format('Y-MM-DD HH:mm:ss')
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
