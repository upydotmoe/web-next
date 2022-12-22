export default function() {
  const openModal = (modalId: string) => {
    const modalToOpen = document.querySelector<HTMLElement>(`#${modalId}`)
    
    if (modalToOpen !== null) {
      modalToOpen.classList.remove('fadeOut')
      modalToOpen.classList.add('fadeIn')
      modalToOpen.style.display = 'flex'
    }
  }

  const closeModal = (modalId: string) => {
    const modalToClose: HTMLElement | null = document.querySelector(`#${modalId}`)
    if (modalToClose) {
      if (modalToClose.classList.contains('fadeIn')) {
        modalToClose.classList.remove('fadeIn')
        modalToClose.classList.add('fadeOut')
        setTimeout(() => {
          modalToClose.style.display = 'none'
        }, 500)
      }
    }
  }

  return {
    openModal,
    closeModal
  }
}
