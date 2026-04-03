import { useState, useEffect, useRef } from 'react'

interface PretextModule {
  prepareWithSegments: (text: string, font: string) => any
  layoutNextLine: (prepared: any, cursor: any, maxWidth: number) => any
}

let cachedModule: PretextModule | null = null
let loadingPromise: Promise<PretextModule> | null = null

function loadPretext(): Promise<PretextModule> {
  if (cachedModule) return Promise.resolve(cachedModule)
  if (loadingPromise) return loadingPromise
  loadingPromise = import('@chenglou/pretext').then((mod) => {
    cachedModule = mod as PretextModule
    return cachedModule
  })
  return loadingPromise
}

export function usePretextEngine(): PretextModule | null {
  const [ready, setReady] = useState(!!cachedModule)
  const modRef = useRef<PretextModule | null>(cachedModule)

  useEffect(() => {
    if (modRef.current) return
    loadPretext().then((mod) => {
      modRef.current = mod
      setReady(true)
    })
  }, [])

  return ready ? modRef.current : null
}
