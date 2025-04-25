import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { FilterPanel } from "@/components/FilterPanel";
import { DoctorListing } from "@/components/DoctorListing";
import { useDoctors } from "@/hooks/useDoctors";
import { useFilteredDoctors } from "@/hooks/useFilteredDoctors";
import { useUrlParams } from "@/hooks/useUrlParams";
import { FilterState, Doctor } from "@/types/doctor";

export default function Home() {
  // Initial filter state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    consultationType: null,
    specialties: [],
    sort: null,
  });
  
  // Fetch doctors data
  const { data: doctors, isLoading } = useDoctors();
  
  // Filter doctors based on filter state
  const filteredDoctors = useFilteredDoctors(doctors, filters);
  
  // Handle URL params
  const { updateUrlParams } = useUrlParams(filters, setFilters);
  
  // Update URL when filters change
  useEffect(() => {
    updateUrlParams();
  }, [filters, updateUrlParams]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };
  
  // Handle search change
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
  };
  
  // Handle doctor selection from autocomplete
  const handleSelectDoctor = (doctor: Doctor) => {
    setFilters(prev => ({ ...prev, search: doctor.name }));
  };
  
  // Handle removing filters
  const handleRemoveFilter = (filterType: keyof FilterState, value?: string) => {
    if (filterType === "specialties" && value) {
      // Remove specific specialty
      setFilters(prev => ({
        ...prev,
        specialties: prev.specialties.filter(s => s !== value)
      }));
    } else {
      // Remove entire filter type
      setFilters(prev => {
        const newFilters = { ...prev };
        if (filterType === "specialties") {
          newFilters.specialties = [];
        } else {
          newFilters[filterType] = null;
        }
        return newFilters;
      });
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header 
        doctors={doctors}
        searchTerm={filters.search}
        onSearchChange={handleSearchChange}
        onSelectDoctor={handleSelectDoctor}
      />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="flex flex-col lg:flex-row gap-6">
          <FilterPanel 
            filters={filters} 
            onFilterChange={handleFilterChange} 
          />
          
          <DoctorListing 
            doctors={filteredDoctors} 
            isLoading={isLoading}
            filters={filters}
            onRemoveFilter={handleRemoveFilter}
          />
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-xl font-semibold mb-4">Doctor Finder</h2>
              <p className="text-gray-400 max-w-md">
                Find the right healthcare professional for your needs with our comprehensive doctor directory.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-3">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
            <p>© 2023 Doctor Finder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
