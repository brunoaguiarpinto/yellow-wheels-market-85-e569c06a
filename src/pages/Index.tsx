
import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import FeaturedVehiclesSection from "@/components/sections/FeaturedVehiclesSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/sections/Footer";
import VehicleDetailsModal from "@/components/modals/VehicleDetailsModal";
import { featuredVehicles, Vehicle } from "@/data/featuredVehicles";

const Index = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const handleViewDetails = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleCloseModal = () => {
    setSelectedVehicle(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeaturedVehiclesSection 
        featuredVehicles={featuredVehicles} 
        onViewDetails={handleViewDetails} 
      />
      <FeaturesSection />
      <CTASection />
      <Footer />
      <VehicleDetailsModal 
        selectedVehicle={selectedVehicle} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default Index;
