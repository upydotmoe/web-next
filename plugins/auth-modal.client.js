export default defineNuxtPlugin((nuxtApp) => {
  const modalClassName = '.auth-modal'
  const modal = document.querySelector(modalClassName)
  const closeButton = document.querySelectorAll('.modal-close')

  for (let i = 0; i < closeButton.length; i++) {
    const elements = closeButton[i]
    elements.onclick = () => close()

    modal.style.display = 'none'

    window.onclick = function (event) {
      if (event.target === this.document.querySelector(modalClassName)) {
        close()
      }
    }
  }

  // close modal
  function close () {
    const modalToClose = document.querySelector(modalClassName)
    modalToClose.classList.remove('fadeIn')
    modalToClose.classList.add('fadeOut')
    setTimeout(() => {
      modalToClose.style.display = 'none'
    }, 500)
  }
})
