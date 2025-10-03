"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check, TrendingUp, Crown } from "lucide-react"
import Link from "next/link"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"

const plans = [
  {
    name: "Starter Basic",
    icon: Check,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    deposit: "25%",
    interest: "6% per annum",
    duration: "24 months",
    payment: "Monthly",
    features: ["Perfect for first-time buyers", "Low initial deposit", "Affordable monthly payments", "Basic support"],
    example: "GHS 2,000/month for a GHS 400,000 home",
    startingPrice: "400,000",
  },
  {
    name: "Starter Plus",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-50",
    deposit: "20%",
    interest: "5.5% per annum",
    duration: "24 months",
    payment: "Monthly",
    features: ["Lower initial deposit", "Better interest rate", "Extended payment period", "Priority support"],
    example: "GHS 1,800/month for a GHS 400,000 home",
    popular: true,
    startingPrice: "400,000",
  },
  {
    name: "Starter Premium",
    icon: Crown,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    deposit: "30%",
    interest: "4.5% per annum",
    duration: "12 months",
    payment: "Monthly",
    features: ["Best interest rate", "Faster completion", "Premium finishes included", "Dedicated support"],
    example: "GHS 2,200/month for a GHS 400,000 home",
    startingPrice: "400,000",
  },
]

export function PlanComparison() {
  const { ref, isVisible } = useScrollAnimation(0.2)

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="py-12 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            return (
              <Card
                key={index}
                className={`relative hover:scale-105 transition-all duration-300 ${
                  plan.popular ? "border-primary border-2 shadow-xl" : "border-border"
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                style={{ transitionDelay: `${index * 0.15}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 animate-pulse">
                    <span className="bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className={`w-10 h-10 rounded-full ${plan.bgColor} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${plan.color}`} />
                  </div>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription className="text-sm">
                    Perfect for {index === 0 ? "first-time buyers" : index === 1 ? "budget-conscious buyers" : "premium seekers"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Deposit</span>
                      <span className="font-semibold text-sm">{plan.deposit}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Interest Rate</span>
                      <span className="font-semibold text-sm">{plan.interest}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Duration</span>
                      <span className="font-semibold text-sm">{plan.duration}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Payment</span>
                      <span className="font-semibold text-sm">{plan.payment}</span>
                    </div>
                  </div>

                  <div className="mb-5">
                    <p className="text-sm font-medium mb-2">What's included:</p>
                    <ul className="space-y-1.5">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-muted p-2.5 rounded-lg mb-3">
                    <p className="text-xs text-muted-foreground mb-1">Example:</p>
                    <p className="text-sm font-medium">{plan.example}</p>
                  </div>

                  <Button
                    asChild
                    className={`w-full hover:scale-105 transition-transform ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    <Link href="/book-appointment">Choose This Plan</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
