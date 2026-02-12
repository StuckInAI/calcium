"use client"

import { useState, useEffect, useCallback } from 'react'

type Operation = '+' | '-' | '×' | '÷' | null

export default function Calculator() {
  const [display, setDisplay] = useState<string>('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<Operation>(null)
  const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)

  const handleNumber = useCallback((num: number) => {
    if (hasError) {
      setDisplay(String(num))
      setHasError(false)
    } else if (waitingForNewValue) {
      setDisplay(String(num))
      setWaitingForNewValue(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + String(num))
    }
  }, [display, waitingForNewValue, hasError])

  const handleOperation = useCallback((op: Operation) => {
    if (hasError) return
    
    const currentValue = parseFloat(display)
    
    if (previousValue === null) {
      setPreviousValue(currentValue)
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation)
      if (result !== null) {
        setPreviousValue(result)
        setDisplay(String(result))
      }
    }
    
    setOperation(op)
    setWaitingForNewValue(true)
  }, [display, previousValue, operation, hasError])

  const handleEquals = useCallback(() => {
    if (hasError || operation === null || previousValue === null) return
    
    const currentValue = parseFloat(display)
    const result = calculate(previousValue, currentValue, operation)
    
    if (result !== null) {
      setDisplay(String(result))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForNewValue(true)
    }
  }, [display, previousValue, operation, hasError])

  const handleClear = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForNewValue(false)
    setHasError(false)
  }, [])

  const handleDecimal = useCallback(() => {
    if (hasError) {
      setDisplay('0.')
      setHasError(false)
    } else if (waitingForNewValue) {
      setDisplay('0.')
      setWaitingForNewValue(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display, waitingForNewValue, hasError])

  const calculate = (a: number, b: number, op: Operation): number | null => {
    switch (op) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '×':
        return a * b
      case '÷':
        if (b === 0) {
          setHasError(true)
          return null
        }
        return a / b
      default:
        return b
    }
  }

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') {
        handleNumber(parseInt(e.key))
      } else if (e.key === '.') {
        handleDecimal()
      } else if (e.key === '+') {
        handleOperation('+')
      } else if (e.key === '-') {
        handleOperation('-')
      } else if (e.key === '*') {
        handleOperation('×')
      } else if (e.key === '/') {
        e.preventDefault()
        handleOperation('÷')
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault()
        handleEquals()
      } else if (e.key === 'Escape' || e.key === 'Delete') {
        handleClear()
      } else if (e.key === 'Backspace') {
        if (!hasError && display.length > 1) {
          setDisplay(display.slice(0, -1))
        } else {
          setDisplay('0')
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleNumber, handleDecimal, handleOperation, handleEquals, handleClear, display, hasError])

  const buttonClasses = "flex items-center justify-center text-xl font-semibold transition-all duration-200 active:scale-95 "
  const numberButtonClasses = buttonClasses + "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-lg shadow-sm"
  const operationButtonClasses = buttonClasses + "bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm"
  const equalsButtonClasses = buttonClasses + "bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-sm"
  const clearButtonClasses = buttonClasses + "bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm"

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 w-full">
      <div className="mb-6">
        <div className="text-right text-sm text-gray-500 dark:text-gray-400 mb-1 min-h-[20px]">
          {previousValue !== null && operation && (
            <span>{previousValue} {operation}</span>
          )}
        </div>
        <div className={`text-right text-4xl font-bold py-4 px-4 rounded-lg overflow-x-auto ${hasError ? 'text-red-500' : 'text-gray-800 dark:text-white'} bg-gray-50 dark:bg-gray-800`}>
          {display}
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1 */}
        <button 
          onClick={handleClear}
          className={clearButtonClasses + " col-span-2 h-16"}
        >
          Clear
        </button>
        <button 
          onClick={() => handleOperation('÷')}
          className={`${operationButtonClasses} h-16 ${operation === '÷' ? 'ring-2 ring-blue-300' : ''}`}
        >
          ÷
        </button>
        <button 
          onClick={() => handleOperation('×')}
          className={`${operationButtonClasses} h-16 ${operation === '×' ? 'ring-2 ring-blue-300' : ''}`}
        >
          ×
        </button>
        
        {/* Row 2 */}
        {[7, 8, 9].map(num => (
          <button 
            key={num}
            onClick={() => handleNumber(num)}
            className={`${numberButtonClasses} h-16`}
          >
            {num}
          </button>
        ))}
        <button 
          onClick={() => handleOperation('-')}
          className={`${operationButtonClasses} h-16 ${operation === '-' ? 'ring-2 ring-blue-300' : ''}`}
        >
          -
        </button>
        
        {/* Row 3 */}
        {[4, 5, 6].map(num => (
          <button 
            key={num}
            onClick={() => handleNumber(num)}
            className={`${numberButtonClasses} h-16`}
          >
            {num}
          </button>
        ))}
        <button 
          onClick={() => handleOperation('+')}
          className={`${operationButtonClasses} h-16 ${operation === '+' ? 'ring-2 ring-blue-300' : ''}`}
        >
          +
        </button>
        
        {/* Row 4 */}
        {[1, 2, 3].map(num => (
          <button 
            key={num}
            onClick={() => handleNumber(num)}
            className={`${numberButtonClasses} h-16`}
          >
            {num}
          </button>
        ))}
        <button 
          onClick={handleEquals}
          className={`${equalsButtonClasses} h-16 row-span-2`}
        >
          =
        </button>
        
        {/* Row 5 */}
        <button 
          onClick={() => handleNumber(0)}
          className={`${numberButtonClasses} h-16 col-span-2`}
        >
          0
        </button>
        <button 
          onClick={handleDecimal}
          className={`${numberButtonClasses} h-16`}
        >
          .
        </button>
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>Tip: You can use your keyboard for calculations</p>
      </div>
    </div>
  )
}
