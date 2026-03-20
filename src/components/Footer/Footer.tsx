import { Link } from "react-router-dom";
import vividstreamLogoDark from "@/assets/vividstream-logo-dark-mode.png";
import vividstreamLogoLight from "@/assets/vividstream-logo-light-mode.png";
import { useTheme } from "../ThemeProvider";

const Footer = () => {
  const { theme } = useTheme();
  const logo = theme === "light" ? vividstreamLogoLight : vividstreamLogoDark;

  return (
    <footer className="py-12 px-4 border-t border-border/50 bg-card/50">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="Vividstream Pro" className="h-20 w-auto" />
            </Link>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for ticket redemption, visa services, and
              travel bookings.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/worldcup"
                  className="hover:text-primary transition-colors"
                >
                  World Cup
                </Link>
              </li>
              <li>
                <Link
                  to="/visa-application"
                  className="hover:text-primary transition-colors"
                >
                  Visa Services
                </Link>
              </li>
              <li>
                <Link
                  to="/hotels"
                  className="hover:text-primary transition-colors"
                >
                  Hotels
                </Link>
              </li>
              <li>
                <Link
                  to="/redeem-ticket"
                  className="hover:text-primary transition-colors"
                >
                  Redeem Ticket
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </li>
              <li>
                <Link
                  to="/admin/login"
                  className="hover:text-primary transition-colors"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <span className="block">
                  119 W 33rd St, New York, NY 10001, USA
                </span>
              </li>
              <li>
                <span className="block">+1 (929) 459-5216</span>
              </li>
              {/* <li>
                <span className="block">support@vividstreampro.com</span>
              </li> */}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
        <div className="pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>
            ©{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}{" "}
            Vividstream Pro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
