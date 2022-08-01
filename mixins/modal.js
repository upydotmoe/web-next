import useModal from '~/composables/useModal'

export default {
  methods: {
    openModal (modalId) {
      useModal().openModal(modalId)
    },
    closeModal (modalId) {
      useModal().closeModal(modalId)
    }
  }
}
