import { useTranslation } from "react-i18next";
import { CreditCard, Globe, Shield } from 'lucide-react'


const TrustSection = () => {
  const { t } = useTranslation();
  
  return (
      <section className="py-12 px-4 border-t border-border/50">
            <div className="container mx-auto">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t("trust.secureEncrypted")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("trust.secureEncryptedDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t("trust.multiplePayment")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("trust.multiplePaymentDesc")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">{t("trust.globalCoverage")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("trust.globalCoverageDesc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
  )
}

export default TrustSection