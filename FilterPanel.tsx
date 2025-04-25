import { useState } from "react";
import { FilterState } from "@/types/doctor";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { 
  Search, 
  Video, 
  Building2, 
  Filter as FilterIcon, 
  X,
  DollarSign,
  TrendingUp
} from "lucide-react";

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filter: Partial<FilterState>) => void;
}

export function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    consultation: true,
    specialties: true,
    sort: true
  });
  
  const specialties = [
    "General-Physician", "Dentist", "Dermatologist", "Paediatrician", 
    "Gynaecologist", "ENT", "Diabetologist", "Cardiologist", 
    "Physiotherapist", "Endocrinologist", "Orthopaedic", "Ophthalmologist",
    "Gastroenterologist", "Pulmonologist", "Psychiatrist", "Urologist",
    "Dietitian-Nutritionist", "Psychologist", "Sexologist", "Nephrologist",
    "Neurologist", "Oncologist", "Ayurveda", "Homeopath"
  ];

  // Filter specialties based on search
  const filteredSpecialties = specialties.filter(specialty => 
    specialty.toLowerCase().replace(/-/g, "/").includes(specialtySearch.toLowerCase())
  );

  // Handle radio change for consultation type
  const handleConsultationChange = (value: string) => {
    onFilterChange({ consultationType: value as 'video' | 'clinic' });
  };

  // Handle checkbox change for specialties
  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    let newSpecialties = [...filters.specialties];
    
    if (checked) {
      if (!newSpecialties.includes(specialty)) {
        newSpecialties.push(specialty);
      }
    } else {
      newSpecialties = newSpecialties.filter(s => s !== specialty);
    }
    
    onFilterChange({ specialties: newSpecialties });
  };

  // Handle radio change for sort
  const handleSortChange = (value: string) => {
    onFilterChange({ sort: value as 'fees' | 'experience' });
  };
  
  // Clear all filters
  const handleClearAll = () => {
    onFilterChange({
      consultationType: null,
      specialties: [],
      sort: null
    });
    setSpecialtySearch("");
  };
  
  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Check if any filter is applied
  const hasActiveFilters = !!filters.consultationType || filters.specialties.length > 0 || !!filters.sort;

  return (
    <aside className="lg:w-1/4 bg-white rounded-lg shadow-sm">
      <div className="p-5 bg-gradient-to-br from-primary/10 to-blue-50 rounded-t-lg border-b border-primary/10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center text-gray-800">
            <FilterIcon className="h-5 w-5 mr-2 text-primary" />
            Filters
          </h2>
          
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-primary hover:text-primary/80 hover:bg-primary/5"
              onClick={handleClearAll}
            >
              <X className="h-3 w-3 mr-1" />
              Clear All
            </Button>
          )}
        </div>
        
        {hasActiveFilters && (
          <div className="mt-3 text-sm text-gray-500">
            <p>
              {filters.specialties.length > 0 && (
                <span className="mr-2">{filters.specialties.length} specialties</span>
              )}
              {filters.consultationType && (
                <span className="mr-2">{filters.consultationType === 'video' ? 'Video Consult' : 'In Clinic'}</span>
              )}
              {filters.sort && (
                <span>Sorted by {filters.sort === 'fees' ? 'fees' : 'experience'}</span>
              )}
            </p>
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Consultation Mode Filter */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center py-3 cursor-pointer"
            onClick={() => toggleSection('consultation')}
            data-testid="filter-header-moc"
          >
            <h3 className="text-base font-medium text-gray-800">Consultation Mode</h3>
            <Button variant="ghost" size="sm" className="p-0 h-5 w-5">
              {expandedSections.consultation ? (
                <span className="text-lg">−</span>
              ) : (
                <span className="text-lg">+</span>
              )}
            </Button>
          </div>
          
          {expandedSections.consultation && (
            <div className="pt-2 pb-4 space-y-3">
              <div 
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors
                  ${filters.consultationType === 'video' 
                  ? 'bg-green-50 border border-green-200 text-green-700' 
                  : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'}`}
                onClick={() => handleConsultationChange('video')}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${filters.consultationType === 'video' ? 'bg-green-100' : 'bg-gray-200'}`}
                  >
                    <Video className="h-4 w-4 text-gray-700" />
                  </div>
                  <div>
                    <Label htmlFor="filter-video-consult" className="font-medium cursor-pointer">Video Consult</Label>
                    <p className="text-xs text-gray-500">Consult from the comfort of home</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                  ${filters.consultationType === 'video' 
                  ? 'border-green-500 bg-green-500' 
                  : 'border-gray-300'}`}
                  data-testid="filter-video-consult"
                >
                  {filters.consultationType === 'video' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              
              <div 
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors
                  ${filters.consultationType === 'clinic' 
                  ? 'bg-blue-50 border border-blue-200 text-blue-700' 
                  : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'}`}
                onClick={() => handleConsultationChange('clinic')}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${filters.consultationType === 'clinic' ? 'bg-blue-100' : 'bg-gray-200'}`}
                  >
                    <Building2 className="h-4 w-4 text-gray-700" />
                  </div>
                  <div>
                    <Label htmlFor="filter-in-clinic" className="font-medium cursor-pointer">In Clinic</Label>
                    <p className="text-xs text-gray-500">Visit the doctor in person</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                  ${filters.consultationType === 'clinic' 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'}`}
                  data-testid="filter-in-clinic"
                >
                  {filters.consultationType === 'clinic' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="my-1" />

        {/* Specialties Filter */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center py-3 cursor-pointer"
            onClick={() => toggleSection('specialties')}
            data-testid="filter-header-speciality"
          >
            <h3 className="text-base font-medium text-gray-800">Speciality</h3>
            <Button variant="ghost" size="sm" className="p-0 h-5 w-5">
              {expandedSections.specialties ? (
                <span className="text-lg">−</span>
              ) : (
                <span className="text-lg">+</span>
              )}
            </Button>
          </div>
          
          {expandedSections.specialties && (
            <div className="pt-2 pb-4">
              <div className="relative mb-3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search specialties..."
                  className="pl-10 py-2 bg-gray-50 text-sm"
                  value={specialtySearch}
                  onChange={(e) => setSpecialtySearch(e.target.value)}
                />
                {specialtySearch && (
                  <button 
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setSpecialtySearch("")}
                  >
                    <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              
              {filters.specialties.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-gray-500">Selected ({filters.specialties.length})</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-primary hover:text-primary/80 hover:bg-primary/5"
                      onClick={() => onFilterChange({ specialties: [] })}
                    >
                      Clear
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.specialties.map(specialty => (
                      <div 
                        key={specialty}
                        className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full flex items-center"
                      >
                        <span>{specialty.replace(/-/g, "/")}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 ml-1 text-primary hover:bg-transparent"
                          onClick={() => handleSpecialtyChange(specialty, false)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="space-y-2 max-h-56 overflow-y-auto pr-2 scrollbar-thin">
                {filteredSpecialties.length > 0 ? (
                  filteredSpecialties.map((specialty) => (
                    <div 
                      className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors
                        ${filters.specialties.includes(specialty) 
                        ? 'bg-primary/5' 
                        : 'hover:bg-gray-50'}`} 
                      key={specialty}
                      onClick={() => handleSpecialtyChange(
                        specialty, 
                        !filters.specialties.includes(specialty)
                      )}
                    >
                      <div className="flex items-center">
                        <Checkbox 
                          id={`specialty-${specialty}`}
                          checked={filters.specialties.includes(specialty)}
                          className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                          onCheckedChange={(checked) => 
                            handleSpecialtyChange(specialty, checked as boolean)
                          }
                          data-testid={`filter-specialty-${specialty}`}
                        />
                        <Label 
                          htmlFor={`specialty-${specialty}`}
                          className="ml-2 text-sm cursor-pointer"
                        >
                          {specialty.replace(/-/g, "/")}
                        </Label>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No specialties found</p>
                    <p className="text-sm">Try a different search term</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Separator className="my-1" />

        {/* Sort Filter */}
        <div className="mb-6">
          <div 
            className="flex justify-between items-center py-3 cursor-pointer"
            onClick={() => toggleSection('sort')}
            data-testid="filter-header-sort"
          >
            <h3 className="text-base font-medium text-gray-800">Sort By</h3>
            <Button variant="ghost" size="sm" className="p-0 h-5 w-5">
              {expandedSections.sort ? (
                <span className="text-lg">−</span>
              ) : (
                <span className="text-lg">+</span>
              )}
            </Button>
          </div>
          
          {expandedSections.sort && (
            <div className="pt-2 pb-4 space-y-3">
              <div 
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors
                  ${filters.sort === 'fees' 
                  ? 'bg-amber-50 border border-amber-200 text-amber-700' 
                  : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'}`}
                onClick={() => handleSortChange('fees')}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${filters.sort === 'fees' ? 'bg-amber-100' : 'bg-gray-200'}`}
                  >
                    <DollarSign className="h-4 w-4 text-gray-700" />
                  </div>
                  <div>
                    <Label htmlFor="sort-fees" className="font-medium cursor-pointer">Fees (Low to High)</Label>
                    <p className="text-xs text-gray-500">Sort by consultation fees</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                  ${filters.sort === 'fees' 
                  ? 'border-amber-500 bg-amber-500' 
                  : 'border-gray-300'}`}
                  data-testid="sort-fees"
                >
                  {filters.sort === 'fees' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
              
              <div 
                className={`flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors
                  ${filters.sort === 'experience' 
                  ? 'bg-purple-50 border border-purple-200 text-purple-700' 
                  : 'bg-gray-50 border border-gray-100 hover:bg-gray-100'}`}
                onClick={() => handleSortChange('experience')}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 
                    ${filters.sort === 'experience' ? 'bg-purple-100' : 'bg-gray-200'}`}
                  >
                    <TrendingUp className="h-4 w-4 text-gray-700" />
                  </div>
                  <div>
                    <Label htmlFor="sort-experience" className="font-medium cursor-pointer">Experience (High to Low)</Label>
                    <p className="text-xs text-gray-500">Sort by years of experience</p>
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border flex items-center justify-center
                  ${filters.sort === 'experience' 
                  ? 'border-purple-500 bg-purple-500' 
                  : 'border-gray-300'}`}
                  data-testid="sort-experience"
                >
                  {filters.sort === 'experience' && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile view filter info */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 md:hidden rounded-b-lg">
        <p className="text-sm text-gray-500 text-center">
          {hasActiveFilters 
            ? `${filters.specialties.length + (filters.consultationType ? 1 : 0) + (filters.sort ? 1 : 0)} filters applied` 
            : "No filters applied"}
        </p>
      </div>
    </aside>
  );
}
