import HeroSection from "../../Components/Home/HeroSection"
import HowItWorks from "../../Components/Home/HowItWorks"
import TabletFeature from "../../Components/Home/TabletFeature"
import CreateAccount from "../../Components/Home/CreateAccount"
import HelpCenter from "../../Components/Home/HelpCenter"
import SiteFooter from "../../Components/SiteFooter/SiteFooter"

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
