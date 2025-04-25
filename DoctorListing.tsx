import { useState, useEffect } from "react";
import { Doctor, FilterState } from "@/types/doctor";
import { DoctorCard } from "./DoctorCard";
import { Badge } from "@/components/ui/badge";
import { 
  XCircle, 
  Loader2, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  Sparkles, 
  Search as SearchIcon,
  ArrowDownUp,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface DoctorListingProps {
  doctors: Doctor[];
  isLoading: boolean;
  filters: FilterState;
  onRemoveFilter: (filterType: keyof FilterState, value?: string) => void;
}

export function DoctorListing({ doctors, isLoading, filters, onRemoveFilter }: DoctorListingProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [doctorsPerPage] = useState(5);
  const [visibleDoctors, setVisibleDoctors] = useState<Doctor[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isExpandedView, setIsExpandedView] = useState(false);
  
  // Calculate total pages and visible doctors whenever doctors list changes
  useEffect(() => {
    const total = Math.ceil(doctors.length / doctorsPerPage);
    setTotalPages(total || 1);
    
    // Reset to page 1 when filter changes
    setCurrentPage(1);
    
    // Update visible doctors
    updateVisibleDoctors(1);
  }, [doctors]);
  
  // Handle page changes
  useEffect(() => {
    updateVisibleDoctors(currentPage);
  }, [currentPage]);
  
  // Update visible doctors based on current page
  const updateVisibleDoctors = (page: number) => {
    const startIndex = (page - 1) * doctorsPerPage;
    const endIndex = startIndex + doctorsPerPage;
    setVisibleDoctors(doctors.slice(startIndex, endIndex));
  };
  
  // Handle pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5;
    
    if (totalPages <= maxPageButtons) {
      // Show all pages if total pages is less than max buttons
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show limited pages with current page in the middle if possible
      let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
      let endPage = startPage + maxPageButtons - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  const renderActiveFilters = () => {
    const activeFilters = [];
    
    // Add search filter tag
    if (filters.search) {
      activeFilters.push(
        <Badge 
          key="search" 
          variant="outline"
          className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors"
        >
          <SearchIcon className="h-3 w-3" />
          <span>{filters.search}</span>
          <XCircle 
            className="h-4 w-4 ml-1 cursor-pointer hover:text-red-500 transition-colors" 
            onClick={() => onRemoveFilter("search")}
          />
        </Badge>
      );
    }
    
    // Add consultation type filter tag
    if (filters.consultationType) {
      const label = filters.consultationType === "video" ? "Video Consult" : "In Clinic";
      activeFilters.push(
        <Badge 
          key="consultationType" 
          variant="outline"
          className="flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors"
        >
          <Filter className="h-3 w-3" />
          <span>{label}</span>
          <XCircle 
            className="h-4 w-4 ml-1 cursor-pointer hover:text-red-500 transition-colors" 
            onClick={() => onRemoveFilter("consultationType")}
          />
        </Badge>
      );
    }
    
    // Add specialty filter tags
    filters.specialties.forEach(specialty => {
      activeFilters.push(
        <Badge 
          key={specialty} 
          variant="outline"
          className="flex items-center gap-1 bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
        >
          <Sparkles className="h-3 w-3" />
          <span>{specialty.replace(/-/g, "/")}</span>
          <XCircle 
            className="h-4 w-4 ml-1 cursor-pointer hover:text-red-500 transition-colors" 
            onClick={() => onRemoveFilter("specialties", specialty)}
          />
        </Badge>
      );
    });
    
    // Add sort filter tag
    if (filters.sort) {
      const label = filters.sort === "fees" 
        ? "Fees (Low to High)" 
        : "Experience (High to Low)";
      activeFilters.push(
        <Badge 
          key="sort" 
          variant="outline"
          className="flex items-center gap-1 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
        >
          <ArrowDownUp className="h-3 w-3" />
          <span>{label}</span>
          <XCircle 
            className="h-4 w-4 ml-1 cursor-pointer hover:text-red-500 transition-colors" 
            onClick={() => onRemoveFilter("sort")}
          />
        </Badge>
      );
    }
    
    return activeFilters;
  };
  
  // Toggle between expanded view (all doctors) and paginated view
  const toggleView = () => {
    setIsExpandedView(!isExpandedView);
  };
  
  const renderDoctorList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm mb-4">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-gray-500">Loading doctors...</p>
          </div>
        </div>
      );
    }
    
    if (doctors.length === 0) {
      return (
        <div className="bg-white p-8 rounded-lg shadow-sm text-center">
          <div className="text-5xl mb-4 text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No doctors found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
          {(filters.search || filters.consultationType || filters.specialties.length > 0 || filters.sort) && (
            <Button 
              variant="outline" 
              className="mx-auto"
              onClick={() => {
                onRemoveFilter("search");
                onRemoveFilter("consultationType");
                onRemoveFilter("specialties");
                onRemoveFilter("sort");
              }}
            >
              Clear All Filters
            </Button>
          )}
        </div>
      );
    }
    
    // Show all doctors in expanded view, otherwise show paginated
    const displayedDoctors = isExpandedView ? doctors : visibleDoctors;
    
    return (
      <div className="space-y-4">
        {displayedDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    );
  };
  
  return (
    <section className="lg:w-3/4">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Doctors Available
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Finding the right healthcare professional for you
            </p>
          </div>
          <div className="flex items-center">
            <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              {isLoading ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              )}
              <span>{isLoading ? "Loading..." : `${doctors.length} doctor${doctors.length !== 1 ? "s" : ""} found`}</span>
            </Badge>
            {doctors.length > doctorsPerPage && (
              <Button
                variant="ghost"
                size="sm"
                className="ml-2 text-xs"
                onClick={toggleView}
              >
                {isExpandedView ? "Show Less" : "Show All"}
              </Button>
            )}
          </div>
        </div>
        
        {renderActiveFilters().length > 0 && (
          <>
            <div className="flex items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">Active Filters:</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                  onRemoveFilter("search");
                  onRemoveFilter("consultationType");
                  onRemoveFilter("specialties");
                  onRemoveFilter("sort");
                }}
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2">
              {renderActiveFilters()}
            </div>
            <Separator className="my-4" />
          </>
        )}
      </div>

      {renderDoctorList()}
      
      {/* Pagination */}
      {!isExpandedView && totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <div className="join">
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-r-none"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            {getPageNumbers().map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                className="rounded-none border-x-0"
                onClick={() => goToPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button 
              variant="outline" 
              size="sm"
              className="rounded-l-none"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
