import Header from "../../components/landing/Header";
import HeroSection from "../../components/landing/HeroSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import HowItWorksSection from "../../components/landing/HowItWorksSection";
import Footer from "../../components/landing/Footer";

export default function LandingPage({ onKakaoLogin }) {
    return (
        <div className="min-h-screen">
            <Header />
            <HeroSection onKakaoLogin={onKakaoLogin}/>
            <FeaturesSection />
            <HowItWorksSection />
            <Footer />
        </div>
    )
}