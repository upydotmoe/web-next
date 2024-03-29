export default function() {
  const config = useRuntimeConfig()

  const generateArtworkThumb = (bucketName: string, fileName: string, mode: 'feed' | 'thumbnail', uncropped: boolean) => {
    let format = ''

    if (typeof uncropped === 'undefined') {
      uncropped = false
    }
    // if (config.public.activeCdn === 'cloudflare') {
    //   switch (mode) {
    //   case 'feed':
    //     format = '/f=auto,w=500,q=50'
    //     break
    //   case 'thumbnail':
    //     format = '/f=auto,w=350'
    //     break
    //   }

    //   return `${config.public.staticallyCdn}/${config.public.cloudflareUrl}${format}/file/${bucketName}/${fileName}`
    // } else {
      // class configured on bunnyCDN panel
      switch (mode) {
        case 'feed':
          format = '?class=feed'
          break
        case 'thumbnail':
          format = uncropped ? '?class=thumbnailUncropped' : '?class=thumbnail'
          break
      }

      return `https://${config.public.cdnUrl}/${fileName}${format}`
    // }
  }

  const generateSemiCompressedArtworkUrl = (bucketName: string, fileName: string, viewMode: boolean) => {
    let format = ''

    if (config.public.activeCdn === 'cloudflare') {
      // no longer using statically, use bunnyCDN instead
      
      // // statically
      // if (viewMode) {
      //   format = '/f=auto,w=500&q=75'
      // }

      // return `${config.public.staticallyCdn}/${config.public.cloudflareUrl}${format}/file/${bucketName}/${fileName}`
    } else {
      // bunny
      if (viewMode) {
        format = '?class=view'
      }

      // return `https://${config.public.cdnUrl}/${bucketName}/${fileName}${format}`
      return `https://${config.public.cdnUrl}/${fileName}${format}`
    }
  }

  const applyExplicitFilter = () => {
    const imageEl: any = document.querySelectorAll('.image-layer')

    for (const el of imageEl) {
      el.classList.add('blur-lg')
    }
  }

  const removeExplicitFilter = () => {
    const imageEl: any = document.querySelectorAll('.image-layer')
    
    for (const el of imageEl) {
      el.classList.remove('blur-lg')
    }
  }

  return {
    generateArtworkThumb,
    generateSemiCompressedArtworkUrl,
    applyExplicitFilter,
    removeExplicitFilter
  }
}
