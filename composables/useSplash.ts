export default function useSplash() {
  const splash = (interval: any, ref: Ref<boolean>, splashId: string) => {
    ref.value = false
    clearTimeout(interval)

    ref.value = true
    
    // hide copied splash alert after 2ms
    interval = setTimeout(() => {
      ref.value = false
      hide(splashId)
    }, 2000)
  }

  const hide = (elementId: string) => {
    const splashEl = document.getElementById(elementId)
    splashEl?.classList.add('fade')
    splashEl?.classList.add('fade-out')
  }

  return {
    splash,
    hide
  }
}
