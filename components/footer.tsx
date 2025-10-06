import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"
import { WhatsAppIcon } from "./icons/whatsapp-icon"

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-bold mb-4">NANDY'S VILLA ROYAL</h3>
            <p className="text-sm text-secondary-foreground/80">
              More than homes - a lifestyle in a secure, coastal-inspired community.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/payment-plans" className="text-sm hover:text-primary transition-colors">
                  Payment Plans
                </Link>
              </li>
              <li>
                <Link href="/build-for-me" className="text-sm hover:text-primary transition-colors">
                  Build For Me
                </Link>
              </li>
              <li>
                <Link href="/book-appointment" className="text-sm hover:text-primary transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wide">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span>Near Nandy's International School, Kwashie-bu, Accra</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={16} className="flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+233208290628" className="hover:text-primary transition-colors">+233208290628</a>
                  <a href="tel:+233598997154" className="hover:text-primary transition-colors">+233598997154</a>
                  <a href="tel:+233200418540" className="hover:text-primary transition-colors">+233200418540</a>
                </div>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <WhatsAppIcon className="w-4 h-4 flex-shrink-0" />
                <a
                  href="https://wa.me/233208290628"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  +233208290628
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={16} className="flex-shrink-0" />
                <a href="mailto:nandysvilla.homes@gmail.com" className="hover:text-primary transition-colors">nandysvilla.homes@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-secondary-foreground/20 text-center text-sm text-secondary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Nandy's Villa Royal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
