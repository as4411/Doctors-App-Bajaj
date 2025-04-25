import { useMemo } from "react";
import { Doctor, FilterState } from "@/types/doctor";

export function useFilteredDoctors(doctors: Doctor[] | undefined, filters: FilterState) {
  return useMemo(() => {
    if (!doctors) return [];
    
    let filteredDoctors = [...doctors];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredDoctors = filteredDoctors.filter(doctor => 
        doctor.name.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply consultation type filter
    if (filters.consultationType) {
      if (filters.consultationType === 'video') {
        filteredDoctors = filteredDoctors.filter(doctor => doctor.videoConsult);
      } else if (filters.consultationType === 'clinic') {
        filteredDoctors = filteredDoctors.filter(doctor => doctor.inClinic);
      }
    }
    
    // Apply specialty filters
    if (filters.specialties.length > 0) {
      filteredDoctors = filteredDoctors.filter(doctor => 
        filters.specialties.some(specialty => 
          doctor.speciality.includes(specialty)
        )
      );
    }
    
    // Apply sorting
    if (filters.sort) {
      if (filters.sort === 'fees') {
        filteredDoctors.sort((a, b) => a.fee - b.fee);
      } else if (filters.sort === 'experience') {
        filteredDoctors.sort((a, b) => b.experience - a.experience);
      }
    }
    
    return filteredDoctors;
  }, [doctors, filters]);
}
