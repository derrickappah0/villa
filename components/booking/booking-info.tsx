import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, MapPin, Phone, Mail } from "lucide-react"

const infoItems = [
  {
    icon: Clock,
    title: "Office Hours",
    details: ["Monday - Friday: 8:00 AM - 6:00 PM", "Saturday: 9:00 AM - 4:00 PM", "Sunday: Closed"],
  },
  {
    icon: MapPin,
    title: "Location",
    details: ["Near Nandy's International School", "Kasoa, Ghana"],
  },
  {
    icon: Phone,
    title: "Phone",
    details: ["+233208290628", "+233598997154", "+233200418540"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["nandysvilla.homes@gmail.com"],
  },
]

export function BookingInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What to Expect</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm mb-2">During Your Visit</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tour of available properties</li>
              <li>• Discussion of payment options</li>
              <li>• Q&A with our team</li>
              <li>• Personalized recommendations</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-2">What to Bring</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Valid ID</li>
              <li>• Budget information</li>
              <li>• List of questions</li>
              <li>• Design preferences (if applicable)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {infoItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  {item.details.map((detail, idx) => (
                    <p key={idx} className="text-sm text-muted-foreground">
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
