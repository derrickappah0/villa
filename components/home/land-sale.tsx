"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

type PlanBreakdown = {
  label: string
  outright?: number
  installments: Array<{
    label: string
    price: number
    upfrontPercentage: number
    upfrontAmount: number
    monthlyAmount: number
    months: number
  }>
}

export function LandSale() {
  const { ref, isVisible } = useScrollAnimation(0.2)

  const plans = useMemo<PlanBreakdown[]>(
    () => [
      {
        label: "Fast Track",
        outright: 50000,
        installments: [
          {
            label: "1st instalment (6 months)",
            price: 55000,
            upfrontPercentage: 40,
            upfrontAmount: 22000,
            monthlyAmount: 5500,
            months: 6,
          },
          {
            label: "2nd instalment (12 months)",
            price: 57500,
            upfrontPercentage: 30,
            upfrontAmount: 17250,
            monthlyAmount: 3355,
            months: 12,
          },
        ],
      },
      {
        label: "Normal Track",
        outright: 35000,
        installments: [
          {
            label: "1st instalment (6 months)",
            price: 38500,
            upfrontPercentage: 40,
            upfrontAmount: 15400,
            monthlyAmount: 3800,
            months: 6,
          },
          {
            label: "2nd instalment (12 months)",
            price: 40250,
            upfrontPercentage: 30,
            upfrontAmount: 12075,
            monthlyAmount: 2348,
            months: 12,
          },
        ],
      },
    ],
    [],
  )

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "GHS",
      maximumFractionDigits: 0,
    }).format(amount)

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-16 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">Own Your Land</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary">Plot Size: 100 × 70</Badge>
          </div>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto text-pretty">
            Flexible land purchase options to fit your budget. Choose outright or installment plans.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {plans.map((plan, idx) => (
            <Card
              key={plan.label}
              className={`border-border transition-all duration-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              <CardHeader>
                <CardTitle className="text-2xl">{plan.label}</CardTitle>
                {typeof plan.outright === "number" && (
                  <CardDescription>
                    Outright: <span className="font-semibold text-foreground">{formatCurrency(plan.outright)}</span>
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.installments.map((inst) => (
                  <div key={inst.label} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="font-medium">{inst.label}</p>
                        <p className="text-sm text-muted-foreground">
                          Plan Price: {formatCurrency(inst.price)} • Pay {inst.upfrontPercentage}% ({formatCurrency(inst.upfrontAmount)})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Monthly</p>
                        <p className="text-lg font-semibold">{formatCurrency(inst.monthlyAmount)} × {inst.months} mo</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/contact">Enquire about {plan.label}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LandSale


