import { useState, useRef, useEffect } from "react";
import { Doctor } from "@/types/doctor";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  X, 
  User, 
  Clock, 
  ArrowRight, 
  Bookmark
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface SearchBarProps {
  doctors: Doctor[] | undefined;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSelectDoctor: (doctor: Doctor) => void;
}

export function SearchBar({ doctors, searchTerm, onSearchChange, onSelectDoctor }: SearchBarProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches] = useState<string[]>(["Cardiologist", "Dentist", "Dr. Smith", "Dermatologist"]);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Get suggestions based on search term
  const suggestions = doctors && searchTerm
    ? doctors
        .filter(doctor => doctor.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .slice(0, 3)
    : [];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setShowSuggestions(value.length > 0);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setShowSuggestions(false);
    }
  };
  
  const handleSuggestionClick = (doctor: Doctor) => {
    onSelectDoctor(doctor);
    setShowSuggestions(false);
    setIsFocused(false);
  };
  
  const handleRecentSearchClick = (term: string) => {
    onSearchChange(term);
    setShowSuggestions(true);
  };
  
  const handleClear = () => {
    onSearchChange("");
    setShowSuggestions(false);
  };
  
  const handleFocus = () => {
    setIsFocused(true);
    if (searchTerm.length > 0) {
      setShowSuggestions(true);
    }
  };
  
  return (
    <div className="relative w-full max-w-lg mx-4" ref={searchRef}>
      <div className={`relative transition-all duration-200 ${isFocused ? 'ring-2 ring-primary/50 shadow-md' : ''}`}>
        <div className="absolute left-3 top-2.5 text-gray-400">
          <Search size={18} />
        </div>
        <Input
          type="text"
          placeholder="Search doctors, specialties, or conditions..."
          className={`w-full pl-10 pr-10 py-2 transition-all duration-200 ${isFocused ? 'border-primary' : ''}`}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          data-testid="autocomplete-input"
        />
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute right-2 top-1.5 h-7 w-7 p-0 text-gray-400 hover:text-gray-600"
            onClick={handleClear}
          >
            <X size={16} />
          </Button>
        )}
      </div>
      
      {isFocused && (
        <div className="absolute w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
          {!doctors ? (
            // Loading state
            <div className="p-4">
              <div className="flex items-center space-x-4 mb-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[180px]" />
                  <Skeleton className="h-3 w-[120px]" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Show recent searches when no search term but focused */}
              {!searchTerm && (
                <div className="p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-500">Recent Searches</h3>
                    <Button variant="ghost" size="sm" className="text-xs h-6 text-primary">
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, index) => (
                      <Badge 
                        key={index} 
                        variant="outline" 
                        className="cursor-pointer bg-gray-50 hover:bg-gray-100"
                        onClick={() => handleRecentSearchClick(term)}
                      >
                        <Clock className="mr-1 h-3 w-3 text-gray-400" />
                        {term}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Show suggestions when there's a search term */}
              {showSuggestions && suggestions.length > 0 ? (
                <div>
                  {suggestions.map((doctor) => (
                    <div
                      key={doctor.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors"
                      onClick={() => handleSuggestionClick(doctor)}
                      data-testid="suggestion-item"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-primary/10 mr-3 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary/60" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{doctor.name}</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <span className="mr-2">{doctor.speciality && Array.isArray(doctor.speciality) ? doctor.speciality.join(", ") : 'Specialist'}</span>
                            <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">₹{doctor.fee}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-2 h-8 w-8 p-0">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="p-4 text-center text-gray-500">
                  <p>No doctors found matching "{searchTerm}"</p>
                  <p className="text-sm mt-1">Try using different keywords or browse by specialty</p>
                </div>
              ) : (
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Searches</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Cardiologist", "Dentist", "Pediatrician", "Dermatologist"].map((specialty, index) => (
                      <div 
                        key={index}
                        className="flex items-center p-2 rounded-md border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleRecentSearchClick(specialty)}
                      >
                        <Bookmark className="h-4 w-4 mr-2 text-primary/70" />
                        <span className="text-sm">{specialty}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Quick actions footer */}
              <div className="bg-gray-50 p-2 text-xs text-gray-500 flex justify-between items-center">
                <span>Press Enter to search</span>
                <span>Use up/down arrows to navigate</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
