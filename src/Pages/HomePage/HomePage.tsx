import HeroSection from "../../Components/Home/HeroSection"
import HowItWorks from "../../Components/Home/HowItWorks"
import TabletFeature from "../../Components/Home/TabletFeature"
import CreateAccount from "../../Components/Home/CreateAccount"
import HelpCenter from "../../Components/Home/HelpCenter"
import SiteFooter from "../../Components/SiteFooter/SiteFooter"

/**
 * The landing page, top to bottom.
 *
 * The order is the argument: show the product, explain the three steps,
 * show it in someone's hands, ask for the account, then answer what is left.
 *
 * The bands alternate ground — Onyx, Onyx, Cream, Onyx, Cream, weathered
 * Onyx — so each section is separated by a tonal break rather than by
 * whitespace. Each declares its own `data-nav-tone`, which is the single
 * signal the navbar re-tones itself from.
 *
 * No max-width and no padding here: every band runs the full viewport width
 * and owns its own vertical rhythm. This file only sequences them.
 */
const HomePage = () => (
  <main className="w-full overflow-x-clip bg-onyx-canvas font-sans text-ivory-text">
    <HeroSection />
    <HowItWorks />
    <TabletFeature />
    <CreateAccount />
    <HelpCenter />
    <SiteFooter />
  </main>
)

export default HomePage
