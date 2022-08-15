export default function () {
  const config = useRuntimeConfig()

  const generateArtworkThumb = (bucketName: string, fileName: string, mode: 'feed' | 'thumbnail') => {
    let format = ''
    if (config.public.activeCdn === 'cloudflare') {
      switch (mode) {
      case 'feed':
        format = '/f=auto,w=500,q=50'
        break
      case 'thumbnail':
        format = '/f=auto,w=350'
        break
      }

      return `${config.public.staticallyCdn}/${config.public.cloudflareUrl}${format}/file/${bucketName}/${fileName}`
    } else {
      // class configured on bunnyCDN panel
      switch (mode) {
      case 'feed':
        format = '?class=feed'
        break
      case 'thumbnail':
        format = '?class=thumbnail'
        break
      }

      return `https://${config.public.bunnyUrl}/${bucketName}/${fileName}${format}`
    }
  }

  const generateSemiCompressedArtworkUrl = (bucketName: string, fileName: string, viewMode: 'cloudflare' | 'bunny') => {
    let format = ''
    if (config.public.activeCdn === 'cloudflare') {
      if (viewMode) {
        format = '/f=auto,q=50'
      }

      return `${config.public.staticallyCdn}/${config.public.cloudflareUrl}${format}/file/${bucketName}/${fileName}`
    } else {
      // bunny
      if (viewMode) {
        format = '?quality=50'
      }

      return `https://${config.public.bunnyUrl}/${bucketName}/${fileName}${format}`
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