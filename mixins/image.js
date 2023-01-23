// import blankImage from '~/static/blank.png'
// import defaultCover from '~/static/bg-abstract.png'

export default {
  methods: {
    artworkUrl(bucketName, fileName, viewMode) {
      return useUpyImage().generateSemiCompressedArtworkUrl(bucketName, fileName, viewMode)
    },
    artworkThumb(bucketName, fileName, mode, uncropped) {
      const imgSrc = useUpyImage().generateArtworkThumb(bucketName, fileName, mode, uncropped)
      return imgSrc
    },
    avatarCoverUrl(bucketName, fileName) {
      /**
       * This following code is currently disabled because we don't see that we will use statically/cloudflare as CDN for image service
       */
      // if (this.$config.activeCdn === 'cloudflare') {
      //   url = `${this.$config.staticallyCdn}/${this.$config.cloudflareUrl}/file/${bucketName}/${fileName}`
      // } else {
      //   url = `https://${this.$config.cdnUrl}/${bucketName}/${fileName}`
      // }

      let url = 'http://notfound.com/neverexist.jpg'

      if (fileName !== null) {
        url = `https://${this.$config.cdnUrl}/${fileName}`
      }

      return url
    },
    imageLoadError(e) {
      // e.target.src = blankImage
      e.target.src = `https://${this.$config.cdnUrl}/static/blank.png`
      e.target.parentElement.href = 'javascript:void(0)'
      e.target.classList.remove('hover:-translate-y-1')
    },
    defaultCoverImage(e) {
      // e.target.src = defaultCover
      e.target.src = `https://${this.$config.cdnUrl}/static/bg-abstract.png?width=500&quality=70`
      e.target.parentElement.href = 'javascript:void(0)'
      e.target.classList.remove('hover:-translate-y-1')
    },
    folderIcon() {
      return `https://${this.$config.cdnUrl}/static/folder.png`
    }
  }
}
