export default function useBounceAnimation() {
  const bounceInterval = 2500

  const animate = (elementId: string) => {
    const el = document.getElementById(elementId)

    el?.classList.add('animate-bounce')
    
    setInterval(() => {
      el?.classList.remove('animate-bounce')
    }, bounceInterval)
  }

  return {
    animate
  }
}
