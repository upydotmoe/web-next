import blankImage from '~/static/blank.png'
import defaultCover from '~/static/bg-abstract.png'

// composables
import useImage from '~/composables/useImage'

export default {
  methods: {
    artworkUrl (bucketName, fileName, viewMode) {
      return useImage().generateSemiCompressedArtworkUrl(bucketName, fileName, viewMode)
    },
    artworkThumb (bucketName, fileName, mode, uncropped) {
      const imgSrc = useImage().generateArtworkThumb(bucketName, fileName, mode, uncropped)
      return imgSrc
    },
    avatarCoverUrl (bucketName, fileName) {
      let url
      // if (this.$config.activeCdn === 'cloudflare') {
      //   url = `${this.$config.staticallyCdn}/${this.$config.cloudflareUrl}/file/${bucketName}/${fileName}`
      // } else {
        // url = `https://${this.$config.cdnUrl}/${bucketName}/${fileName}`
        url = `https://${this.$config.cdnUrl}/${fileName}`
      // }

      return url
    },
    imageLoadError (e) {
      e.target.src = blankImage
      e.target.parentElement.href = 'javascript:void(0)'
      e.target.classList.remove('hover:-translate-y-1')
    },
    defaultCoverImage (e) {
      e.target.src = defaultCover
      e.target.parentElement.href = 'javascript:void(0)'
      e.target.classList.remove('hover:-translate-y-1')
    }
  }
}
