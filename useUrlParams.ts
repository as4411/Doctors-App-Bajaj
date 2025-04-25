import { useLocation, useSearch } from "wouter";
import { FilterState } from "@/types/doctor";
import { useCallback, useEffect } from "react";

export function useUrlParams(
  filters: FilterState,
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
) {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  
  // Parse URL params and update filters
  useEffect(() => {
    const params = new URLSearchParams(search);
    
    const searchParam = params.get("search");
    const consultationType = params.get("consultation") as FilterState["consultationType"];
    const specialtiesParam = params.get("specialties");
    const sortParam = params.get("sort") as FilterState["sort"];
    
    const newFilters: FilterState = { ...filters };
    
    if (searchParam) newFilters.search = searchParam;
    if (consultationType) newFilters.consultationType = consultationType;
    if (specialtiesParam) newFilters.specialties = specialtiesParam.split(",");
    if (sortParam) newFilters.sort = sortParam;
    
    setFilters(newFilters);
    
    // Only run on initial load and when URL changes externally
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, setFilters]);
  
  // Update URL based on filters
  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();
    
    if (filters.search) params.set("search", filters.search);
    if (filters.consultationType) params.set("consultation", filters.consultationType);
    if (filters.specialties.length > 0) params.set("specialties", filters.specialties.join(","));
    if (filters.sort) params.set("sort", filters.sort);
    
    const newSearch = params.toString() ? `?${params.toString()}` : "";
    
    // Only update if the search part is different to avoid unnecessary history entries
    if (newSearch !== search) {
      setLocation(newSearch, { replace: false });
    }
  }, [filters, search, setLocation]);

  return { updateUrlParams };
}
