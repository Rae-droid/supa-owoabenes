"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Calculator() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(true)

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num)
      setNewNumber(false)
    } else {
      setDisplay(display === "0" ? num : display + num)
    }
  }

  const handleDecimal = () => {
    if (!display.includes(".")) {
      setDisplay(display + ".")
      setNewNumber(false)
    }
  }

  const handleOperation = (op: string) => {
    const currentValue = Number.parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(currentValue)
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation)
      setDisplay(result.toString())
      setPreviousValue(result)
    }

    setOperation(op)
    setNewNumber(true)
  }

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case "+":
        return prev + current
      case "-":
        return prev - current
      case "*":
        return prev * current
      case "/":
        return prev / current
      default:
        return current
    }
  }

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, Number.parseFloat(display), operation)
      setDisplay(result.toString())
      setPreviousValue(null)
      setOperation(null)
      setNewNumber(true)
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  return (
    <Card className="bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="bg-primary/10 p-3 rounded text-right text-2xl font-bold text-primary truncate">{display}</div>
        <div className="grid grid-cols-4 gap-1">
          {[
            ["7", "8", "9", "/"],
            ["4", "5", "6", "*"],
            ["1", "2", "3", "-"],
            ["0", ".", "=", "+"],
          ].map((row) =>
            row.map((char) => (
              <Button
                key={char}
                onClick={() => {
                  if (char === "=") handleEquals()
                  else if (char === ".") handleDecimal()
                  else if (["+", "-", "*", "/"].includes(char)) handleOperation(char)
                  else handleNumber(char)
                }}
                className={`h-10 text-sm font-bold ${
                  ["=", "+", "-", "*", "/"].includes(char)
                    ? "bg-accent hover:bg-accent/90 text-accent-foreground"
                    : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                }`}
              >
                {char}
              </Button>
            )),
          )}
          <Button
            onClick={handleClear}
            className="col-span-4 h-10 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-bold"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
