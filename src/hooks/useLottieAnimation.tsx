import { useEffect, useRef, useState } from 'react'

import { LottiePlayer } from 'lottie-web'

export const useLottieAnimation = (fileName: string) => {
  const ref = useRef<HTMLDivElement>(null)
  const [lottie, setLottie] = useState<LottiePlayer | null>(null)

  useEffect(() => {
    import('lottie-web').then((Lottie) => setLottie(Lottie.default))
  }, [])

  useEffect(() => {
    if (lottie && ref.current) {
      const animation = lottie.loadAnimation({
        container: ref.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: `/lottie-files/${fileName}`,
      })

      return () => animation.destroy()
    }
  }, [fileName, lottie])

  return ref
}
