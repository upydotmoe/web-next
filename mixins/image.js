import blankImage from '~/static/blank.png'

// composables
import useImage from '~/composables/useImage'

export default {
  methods: {
    artworkUrl (bucketName, fileName, viewMode) {
      return useImage().generateSemiCompressedArtworkUrl(bucketName, fileName, viewMode)
    },
    artworkThumb (bucketName, fileName, mode) {
      return useImage().generateArtworkThumb(bucketName, fileName, mode)
    },
    avatarCoverUrl (bucketName, fileName) {
      let url
      if (this.$config.activeCdn === 'cloudflare') {
        url = `${this.$config.staticallyCdn}/${this.$config.cloudflareUrl}/file/${bucketName}/${fileName}`
      } else {
        url = `https://${this.$config.bunnyUrl}/${bucketName}/${fileName}`
      }

      return url
    },
    imageLoadError (e) {
      e.target.src = blankImage
      e.target.parentElement.href = 'javascript:void(0)'
      e.target.classList.remove('hover:-translate-y-1')
    }
  }
}
