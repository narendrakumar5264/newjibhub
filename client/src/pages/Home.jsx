import React, { useEffect, useState, useContext } from 'react';
import { ThemeContext } from "../context/ThemeContext";

import HeroSection from '../components/home/HeroSection.jsx';
import AiInterviewBanner from '../components/home/AiInterviewBanner.jsx';
import CompanyLogos from '../components/home/CompanyLogos.jsx';
import PremiumAccess from '../components/home/PremiumAccess.jsx';
import RecentJobs from '../components/home/RecentJobs.jsx';
import AboutSection from '../components/home/AboutSection.jsx';
import Footer from '../components/common/Footer.jsx';

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch('/api/listing/get');
        const data = await res.json();
        setOfferListings(data);
        setRentListings(data);
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className={`${theme === "dark" ? "dark" : ""}`}>
      <HeroSection />
      <AiInterviewBanner />
      <CompanyLogos />
      <PremiumAccess />
      <RecentJobs rentListings={rentListings} saleListings={saleListings} />
      <AboutSection />
      <Footer />
    </div>
  );
}