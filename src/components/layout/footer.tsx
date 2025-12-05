import Link from "next/link";
import { GraduationCap, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Vietnamese Professors
              </span>
            </Link>
            <p className="text-sm">
              Connecting students with verified professors across Vietnam.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Product</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/professors"
                  className="hover:text-purple-400 transition-colors"
                >
                  Browse Professors
                </Link>
              </li>
              <li>
                <Link
                  href="/leaderboard"
                  className="hover:text-purple-400 transition-colors"
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-purple-400 transition-colors"
                >
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-purple-400 transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-purple-400 transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-purple-400 transition-colors"
                >
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm">Contact</h3>
            <a
              href="mailto:support@vietnameseprofessors.com"
              className="flex items-center gap-2 text-sm hover:text-purple-400 transition-colors"
            >
              <Mail className="w-4 h-4" />
              support@vietnameseprofessors.com
            </a>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
          <p>© {currentYear} Vietnamese Professors. All rights reserved.</p>
          <p>Made with ❤️ for Vietnamese students</p>
        </div>
      </div>
    </footer>
  );
}
