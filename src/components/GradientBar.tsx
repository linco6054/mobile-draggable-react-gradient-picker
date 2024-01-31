import React, { useState, useEffect } from 'react'
import { getHandleValue } from '../utils/utils.js'
import { usePicker } from '../context.js'

const handleStyle = (isSelected: boolean) => {
  return {
    boxShadow: isSelected ? '0px 0px 5px 1px rgba(86, 140, 245,.95)' : '',
    border: isSelected ? '2px solid white' : '2px solid rgba(255,255,255,.75)',
  }
}

export const Handle = ({
  left,
  i,
  setDragging,
  setInFocus,
}: {
  left?: number
  i: number
  setDragging: (arg0: boolean) => void
  setInFocus: (arg0: string | null) => void
}) => {
  const { setSelectedColor, selectedColor, squareSize } = usePicker()
  const isSelected = selectedColor === i
  const leftMultiplyer = (squareSize - 18) / 100

  const handleDown = (e: any) => {
    e.stopPropagation()
    setSelectedColor(i)
    setDragging(true)
  }

  const handleFocus = () => {
    setInFocus('gpoint')
    setSelectedColor(i)
  }

  const handleBlur = () => {
    setInFocus(null)
  }

  return (
    <div
      tabIndex={0}
      onBlur={handleBlur}
      onFocus={handleFocus}
      id={`gradient-handle-${i}`}
      onMouseDown={(e) => handleDown(e)}
      style={{ left: (left || 0) * leftMultiplyer }}
      className="rbgcp-gradient-handle-wrap"
    >
      <div style={handleStyle(isSelected)} className="rbgcp-gradient-handle">
        {isSelected && (
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
    </div>
  )
}

const GradientBar = () => {
  const {
    currentColor,
    addPoint,
    colors,
    value,
    handleGradient,
    squareSize,
    deletePoint,
    isGradient,
    selectedColor,
    inFocus,
    setInFocus,
    createGradientStr,
  } = usePicker()
  const [dragging, setDragging] = useState(false)

  function force90degLinear(color: string) {
    return color.replace(
      /(radial|linear)-gradient\([^,]+,/,
      'linear-gradient(90deg,'
    )
  }

  useEffect(() => {
    const selectedEl = window?.document?.getElementById(
      `gradient-handle-${selectedColor}`
    )
    if (selectedEl) {
      selectedEl.focus()
    }
  }, [selectedColor])

  const stopDragging = () => {
    setDragging(false)
  }

  const handleDown = (e: any) => {
    if (!dragging) {
      //  addPoint(e);
      setDragging(true)
    }
  }

  const handleMove = (e: any) => {
    if (dragging) {
      handleGradient(currentColor, getHandleValue(e))
    }
  }

  const handleKeyboard = (e: any) => {
    if (isGradient) {
      if (e.keyCode === 8) {
        if (inFocus === 'gpoint') {
          deletePoint()
        }
      }
    }
  }

  const handleUp = () => {
    stopDragging()
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleUp)
    window?.addEventListener('keydown', handleKeyboard)

    return () => {
      window.removeEventListener('mouseup', handleUp)
      window?.removeEventListener('keydown', handleKeyboard)
    }
  })
  const handleClick = (e: any) => {
    const clickPosition =
      (e.clientX - e.target.getBoundingClientRect().left) / e.target.offsetWidth
    const clickedAt = clickPosition * 100
    const newColors = colors
    const closestLeft = newColors.reduce((closest: any, current: any) => {
      const currentDistance = Math.abs(current.left - clickPosition * 100)
      const closestDistance = Math.abs(closest.left - clickPosition * 100)

      return currentDistance < closestDistance ? current : closest
    }, colors[0])
    closestLeft.left = clickedAt
    createGradientStr(newColors as any)
  }
  return (
    <div
      style={{
        width: '100%',
        marginTop: 17,
        marginBottom: 4,
        position: 'relative',
      }}
      id="gradient-bar"
    >
      <div
        style={{
          width: squareSize,
          height: 14,
          backgroundImage: force90degLinear(value),
          borderRadius: 10,
        }}
        onMouseDown={(e) => handleDown(e)}
        onMouseMove={(e) => handleMove(e)}
        onClick={(e) => handleClick(e)}
      />
      {colors?.map((c: any, i) => (
        <Handle
          i={i}
          left={c.left}
          key={`${i}-${c}`}
          setInFocus={setInFocus}
          setDragging={setDragging}
        />
      ))}
    </div>
  )
}

export default GradientBar
