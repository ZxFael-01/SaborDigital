import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import { useEffect } from 'react';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Sabor Digital - Cardápios Digitais Personalizáveis';
  }, []);

  return (
    <>
      <HeroSection />
      <TestimonialsSection />
      <FeaturesSection />
    </>
  );
};

export default HomePage;