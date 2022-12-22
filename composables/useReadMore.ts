export default function() {
  const readMore = (description: string, id: number, selectorElId: string, descriptionElId: string) => {
    const descriptionEl = document.getElementById(`${descriptionElId}${id}`)
    if (descriptionEl !== null) {
      descriptionEl.innerHTML = description
    }

    const readMoreEl = document.getElementById(`${selectorElId}${id}`)
    readMoreEl?.remove()
  }

  return {
    readMore
  }
}
