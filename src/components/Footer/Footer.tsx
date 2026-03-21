import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import vividstreamLogoDark from "@/assets/vividstream-logo-dark-mode.png";
import vividstreamLogoLight from "@/assets/vividstream-logo-light-mode.png";
import { useTheme } from "../ThemeProvider";

const Footer = () => {
  const { t } = useTranslation();
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
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.services")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/worldcup"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.worldCup")}
                </Link>
              </li>
              <li>
                <Link
                  to="/visa-application"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.visaServices")}
                </Link>
              </li>
              <li>
                <Link
                  to="/hotels"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.hotels")}
                </Link>
              </li>
              <li>
                <Link
                  to="/redeem-ticket"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.redeemTicket")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary transition-colors"
                >
                  {t("footer.contactUs")}
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.careers")}
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.legal")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.privacyPolicy")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.termsOfService")}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t("footer.cookiePolicy")}
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
            <h4 className="font-semibold mb-4">{t("footer.contact")}</h4>
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
            <h4 className="font-semibold mb-4">{t("footer.followUs")}</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.facebook")}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.twitter")}
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.instagram")}
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
