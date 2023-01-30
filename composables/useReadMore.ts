export default function() {
  const readMore = (description: string, id: number, selectorElId: string, descriptionElId: string) => {
    console.log('read more:', [id, selectorElId, descriptionElId])
    const descriptionEl = document.getElementById(`${descriptionElId}${id}`)
    if (descriptionEl) {
      descriptionEl.innerHTML = description
    }

    const readMoreEl = document.getElementById(`${selectorElId}${id}`)
    if (readMoreEl) {
      readMoreEl.classList.add('hidden')
    }
  }

  return {
    readMore
  }
}
