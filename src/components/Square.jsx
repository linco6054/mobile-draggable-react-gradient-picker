import React, { useRef, useEffect, useCallback } from 'react'
import usePaintSquare from '../hooks/usePaintSquare'
import { usePicker } from '../context'

const Square = () => {
  const {
    x,
    y,
    isMobile,
    squareSize,
    handleColor,
    internalHue,
    squareHeight,
    dragging,
    setDragging,
  } = usePicker()

  const canvas = useRef(null)
  usePaintSquare(canvas, internalHue, squareSize, squareHeight)

  const handleChange = (e) => {
    const ctx = canvas?.current?.getContext('2d', { willReadFrequently: true })
    handleColor(e, ctx)
  }

  const handleInteraction = useCallback(
    (e) => {
      if (
        dragging === 'Square' ||
        (e.type === 'click' && e.target?.id === 'paintSquare')
      ) {
        if (isMobile) {
          document.body.style.overflow = 'hidden'
        }
        handleChange(e)
      }
    },
    [dragging, isMobile]
  )

  useEffect(() => {
    const handleUp = () => {
      setDragging(null)
      document.body.style.overflow = 'auto'
    }

    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchend', handleUp)

    return () => {
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchend', handleUp)
    }
  }, [])

  return (
    <div style={{ position: 'relative' }}>
      <div
        className="ps-rl c-cross"
        onMouseDown={() => setDragging('Square')}
        onTouchStart={() => setDragging('Square')}
        onMouseMove={handleInteraction}
        onTouchMove={handleInteraction}
      >
        <div
          className="rbgcp-handle"
          style={{
            left: x,
            top: y,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {dragging === 'Square' && (
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                background: 'white',
              }}
            />
          )}
        </div>
        <div
          className="rbgcp-canvas-wrapper"
          style={{ height: squareHeight }}
          onClick={handleInteraction}
        >
          <canvas
            ref={canvas}
            width={`${squareSize}px`}
            height={`${squareHeight}px`}
            id="paintSquare"
          />
        </div>
      </div>
    </div>
  )
}

export default Square
