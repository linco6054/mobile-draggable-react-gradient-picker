import React, { useRef, useState, useEffect, useCallback } from 'react'
import { usePicker } from '../context'
import usePaintHue from '../hooks/usePaintHue'
const dragName = 'HUE'
const Hue = () => {
  const barRef = useRef(null)
  const { handleHue, internalHue, squareSize, dragging, setDragging } =
    usePicker()

  const handleInteraction = useCallback(
    (e) => {
      if (dragging === dragName || e.type === 'click') {
        if (
          e.type === 'touchmove' ||
          e.type === 'touchend' ||
          (e.type === 'click' && e.target?.id === 'canvas')
        ) {
          if (e.changedTouches && e.changedTouches.length > 1)
            e.preventDefault()
          const location = e.type === 'click' ? e : e.targetTouches[0]
          handleHue(location)
        } else {
          handleHue(e)
        }
      }
    },
    [dragging, dragName]
  )

  useEffect(() => {
    const handleUp = () => setDragging(null)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchend', handleUp)
    return () => {
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchend', handleUp)
    }
  }, [])
  const left = internalHue * ((squareSize - 18) / 360)

  return (
    <div
      style={{
        height: 14,
        marginTop: 17,
        marginBottom: 4,
        touchAction: 'none',
      }}
      onMouseMove={handleInteraction}
      onTouchMove={handleInteraction}
      className="c-resize ps-rl"
    >
      <div
        style={{
          left: isNaN(left) || left > squareSize ? 0 : left,
          top: -3,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: '2px solid white',
          borderRadius: '50%',
          boxShadow: '0px 0px 3px rgba(0, 0, 0, 0.5)',
          width: '18px',
          height: '18px',
          zIndex: 1000,
          transition: 'all 10ms linear',
          position: 'absolute',
        }}
        onMouseDown={() => setDragging(dragName)}
        onTouchStart={() => setDragging(dragName)}
        className="rbgcp-handle"
      >
        {dragging === dragName && (
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
      <canvas
        ref={barRef}
        id="canvas"
        width={`${squareSize}px`}
        height="14px"
        style={{ position: 'relative', borderRadius: 14, verticalAlign: 'top' }}
        onClick={handleInteraction}
        onTouchEnd={handleInteraction}
      />
    </div>
  )
}

export default Hue
