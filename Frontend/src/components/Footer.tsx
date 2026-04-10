import Logo from "./Logo";
import { Leaf, Mail, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Logo size="md" />
            <p className="text-muted-foreground text-sm max-w-xs">
              AI-powered crop pest and disease detection for smarter, healthier farming.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/camera-upload" className="text-muted-foreground hover:text-primary transition-colors">
                  Start Detection
                </a>
              </li>
              <li>
                <a href="/results" className="text-muted-foreground hover:text-primary transition-colors">
                  View Results
                </a>
              </li>
              <li>
                <a href="/profile" className="text-muted-foreground hover:text-primary transition-colors">
                  My Profile
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                support@smartcropdetector.com
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Leaf className="w-4 h-4 text-primary" />
                Helping farmers worldwide
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2024 Smart Crop Detector. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;