import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

const contactDetails = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Nandy's Villa Royal", "Near Nandy's International School", "Kasoa, Ghana"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+233208290628", "+233598997154", "+233200418540"],
    action: "tel:+233208290628",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["nandysvilla.homes@gmail.com"],
    action: "mailto:nandysvilla.homes@gmail.com",
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Mon - Fri: 8:00 AM - 6:00 PM", "Sat: 9:00 AM - 4:00 PM", "Sun: Closed"],
  },
]

export function ContactSplit() {
  return (
    <section className="py-12 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Side - Contact Information */}
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-secondary-foreground mb-3">Contact Information</h2>
              <p className="text-sm text-secondary-foreground/80 text-pretty">
                We're available to answer your questions and help you find your perfect home.
              </p>
            </div>

            <div className="space-y-3">
              {contactDetails.map((detail, index) => {
                const Icon = detail.icon
                return (
                  <Card key={index} className="border-border">
                    <CardContent className="pt-4 pb-4">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-card-foreground mb-1.5 text-sm">{detail.title}</h3>
                          {detail.details.map((line, idx) => (
                            <p key={idx} className="text-xs text-muted-foreground">
                              {detail.action && idx === 0 ? (
                                <a href={detail.action} className="hover:text-primary transition-colors">
                                  {line}
                                </a>
                              ) : (
                                line
                              )}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="h-[500px] rounded-lg overflow-hidden shadow-xl">
            <iframe
              src="https://www.google.com/maps?q=JP2J%2BVJM%2C%20Kwashieman&hl=en&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Nandy's Villa Royal Location"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
