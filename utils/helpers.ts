export const getCookieValue = (cookieName: string) => {
  const match = document.cookie.match(new RegExp('(^| )' + cookieName + '=([^;]+)'));
  if (match)
    return match[2]
}

export const removeAuthenticatedUserCookies = () => {
  document.cookie = 'available_artwork=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
}