"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"

interface PlanCalculation {
  name: string
  deposit: number
  totalInterest: number
  totalAmount: number
  monthlyPayment?: number
  quarterlyPayment?: number
}

export function PaymentCalculator() {
  const [housePrice, setHousePrice] = useState<string>("400000")
  const [calculations, setCalculations] = useState<PlanCalculation[]>([])

  const calculatePlans = () => {
    const price = Number.parseFloat(housePrice) || 0
    if (price <= 0) return

    const plans: PlanCalculation[] = [
      {
        name: "Starter Basic",
        deposit: price * 0.25,
        totalInterest: price * 0.75 * 0.055 * 2, // 24 months at ~5.5% p.a. example
        totalAmount: 0,
        monthlyPayment: 0,
      },
      {
        name: "Starter Premium",
        deposit: price * 0.3,
        totalInterest: price * 0.7 * 0.045 * 1, // 12 months at 4.5% p.a. example
        totalAmount: 0,
        monthlyPayment: 0,
      },
    ]

    // 24 months for Basic
    plans[0].totalAmount = plans[0].deposit + price * 0.75 + plans[0].totalInterest
    plans[0].monthlyPayment = (price * 0.75 + plans[0].totalInterest) / 24

    // 12 months for Premium
    plans[1].totalAmount = plans[1].deposit + price * 0.7 + plans[1].totalInterest
    plans[1].monthlyPayment = (price * 0.7 + plans[1].totalInterest) / 12

    setCalculations(plans)
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">Starter Plan Calculator</h2>
          <p className="text-lg text-muted-foreground text-pretty">
            Calculate your monthly payments for our starter plans. Perfect for first-time homebuyers starting from 400,000 cedis.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Calculate Your Payments
            </CardTitle>
            <CardDescription>Enter your desired home price (minimum 400,000 cedis) to see a breakdown for each starter plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label htmlFor="house-price">Home Price (GHS)</Label>
                <Input
                  id="house-price"
                  type="number"
                  placeholder="400000"
                  value={housePrice}
                  onChange={(e) => setHousePrice(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={calculatePlans} className="w-full sm:w-auto">
                  Calculate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {calculations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {calculations.map((calc, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{calc.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Initial Deposit:</span>
                    <span className="font-semibold">GHS {calc.deposit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Interest:</span>
                    <span className="font-semibold">GHS {calc.totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Amount:</span>
                    <span className="font-semibold">GHS {calc.totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 border-t border-border">
                    {calc.monthlyPayment && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Monthly:</span>
                        <span className="font-bold text-primary">GHS {calc.monthlyPayment.toLocaleString()}</span>
                      </div>
                    )}
                    {calc.quarterlyPayment && (
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Quarterly:</span>
                        <span className="font-bold text-primary">GHS {calc.quarterlyPayment.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
