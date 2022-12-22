export default function useFunction() {
  const removeHtmlTags = (html: string) => {
    const htmlRegexG = /<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/g;
    const text = html.replace(htmlRegexG, '')

    return text
  }

  const cutText = (text: string, maxLength: number) => {
    if (text.length < maxLength) {
      return text
    }
    
    const slicedText = text.slice(0, maxLength)
    return `${slicedText}..`
  }

  return {
    removeHtmlTags,
    cutText,
  }
} 