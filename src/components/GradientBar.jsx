import React, { useState, useEffect } from 'react'
import { getHandleValue, getHandleValueTouch } from '../utils/utils'
import { usePicker } from '../context'
const dragName = 'GradientBar'
const GradientBar = ({ addPointOnClick }) => {
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
    dragging,
    setDragging,
    isMobile,
    createGradientStr,
  } = usePicker()

  function force90degLinear(color) {
    return color.replace(
      /(radial|linear)-gradient\([^,]+,/,
      'linear-gradient(90deg,'
    )
  }

  useEffect(() => {
    let selectedEl = window?.document?.getElementById(
      `gradient-handle-${selectedColor}`
    )
    selectedEl.focus()
  }, [selectedColor])

  const stopDragging = () => {
    setDragging(null)
  }
  const handleTouchMove = (e) => {
    if (dragging === dragName && e.target.id?.includes('squerEl') && isMobile) {
      handleGradient(currentColor, getHandleValueTouch(e))
    }
  }
  const handleDown = (e) => {
    if (dragging !== dragName) {
      addPointOnClick && addPoint(e)
      setDragging(dragName)
    }
  }

  const handleMove = (e) => {
    if (
      dragging === dragName &&
      !isMobile &&
      e.target.id === 'gradient-bar-progress'
    ) {
      handleGradient(currentColor, getHandleValue(e))
    }
  }

  const handleKeyboard = (e) => {
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

  const handleClick = (e) => {
    const clickPosition =
      (e.clientX - e.target.getBoundingClientRect().left) / e.target.offsetWidth
    const clickedAt = clickPosition * 100
    const newColors = colors
    const closestLeft = newColors.reduce((closest, current) => {
      const currentDistance = Math.abs(current.left - clickPosition * 100)
      const closestDistance = Math.abs(closest.left - clickPosition * 100)

      return currentDistance < closestDistance ? current : closest
    }, colors[0])
    closestLeft.left = clickedAt
    createGradientStr(newColors)
  }

  useEffect(() => {
    if (dragging === dragName) {
      window.addEventListener('mouseup', handleUp)
      window?.addEventListener('keydown', handleKeyboard)
    }

    return () => {
      if (dragging === dragName) {
        window.addEventListener('mouseup', handleUp)
        window?.addEventListener('keydown', handleKeyboard)
      }
    }
  }, [dragging === dragName, isMobile])

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
        onClick={handleClick}
        id="gradient-bar-progress"
      />
      {colors?.map((c, i) => (
        <Handle
          i={i}
          left={c.left}
          key={`${i}-${c}`}
          handleTouchMove={handleTouchMove}
          setInFocus={setInFocus}
          handleUp={handleUp}
        />
      ))}
    </div>
  )
}

export default GradientBar

export const Handle = ({ left, i, setInFocus, handleTouchMove, handleUp }) => {
  const {
    setSelectedColor,
    selectedColor,
    squareSize,
    setDragging,
    dragging,
    isMobile,
  } = usePicker()
  const isSelected = selectedColor === i
  const leftMultiplyer = (squareSize - 18) / 100

  const handleDown = (e) => {
    e.stopPropagation()
    setSelectedColor(i)
    setDragging(dragName)
  }

  const handleFocus = () => {
    setInFocus('gpoint')
    setSelectedColor(i)
  }

  const handleBlur = () => {
    setInFocus(null)
  }

  useEffect(() => {
    if (dragging === dragName) {
      if (isMobile) {
        window.addEventListener('touchend', handleUp)
        window?.addEventListener('touchmove', handleTouchMove)
      }
    }

    return () => {
      if (isMobile) {
        window.addEventListener('touchend', handleUp)
        window?.addEventListener('touchmove', handleTouchMove)
      }
    }
  }, [dragging === dragName, isMobile])

  return (
    <div
      tabIndex={0}
      onBlur={handleBlur}
      onFocus={handleFocus}
      id={`gradient-handle-${i}`}
      onMouseDown={(e) => handleDown(e)}
      style={{ left: left * leftMultiplyer }}
      className="rbgcp-gradient-handle-wrap"
    >
      <div
        id="squerEl"
        style={handleStyle(isSelected)}
        className="rbgcp-gradient-handle"
      >
        {isSelected && (
          <div
            id={'squerEl' + i}
            //  onTouchMove={handleTouchMove}
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

const handleStyle = (isSelected) => {
  return {
    boxShadow: isSelected ? '0px 0px 5px 1px rgba(86, 140, 245,.95)' : '',
    border: isSelected ? '2px solid white' : '2px solid rgba(255,255,255,.75)',
  }
}
