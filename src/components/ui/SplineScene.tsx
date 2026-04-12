'use client'

import { useState } from 'react'
import Spline from '@splinetool/react-spline'

interface SplineSceneProps {
  /** The Spline scene URL (e.g. https://prod.spline.design/xxxxx/scene.splinecode) */
  sceneUrl: string
  /** Optional CSS class for the wrapper div */
  className?: string
  /** Optional inline styles for the wrapper div */
  style?: React.CSSProperties
  /** Show a loading state while the scene loads (default: true) */
  showLoader?: boolean
}

export default function SplineScene({
  sceneUrl,
  className = '',
  style,
  showLoader = true,
}: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        ...style,
      }}
    >
      {showLoader && !isLoaded && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'transparent',
            zIndex: 1,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              border: '3px solid rgba(0,181,214,0.2)',
              borderTopColor: '#00B5D6',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
      <Spline
        scene={sceneUrl}
        onLoad={() => setIsLoaded(true)}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
