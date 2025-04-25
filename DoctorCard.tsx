import { useState } from "react";
import { Doctor } from "@/types/doctor";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Briefcase, 
  Video, 
  Building2, 
  Star, 
  Calendar, 
  Clock, 
  ThumbsUp, 
  Award,
  MapPin,
  Heart,
  ChevronDown,
  ChevronUp,
  Share2,
  CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDoctorImage, getDoctorPrefix } from "@/lib/doctorImages";

interface DoctorCardProps {
  doctor: Doctor;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // Generate a consistent profile image URL based on doctor ID
  const doctorImage = getDoctorImage(doctor.id);
  const doctorPrefix = getDoctorPrefix(doctor.name);
  
  // Generate a random rating between 4.0 and 5.0
  const rating = (4 + Math.random()).toFixed(1);
  
  // Generate a random number of reviews between 50 and 300
  const reviews = Math.floor(Math.random() * (300 - 50) + 50);
  
  // Generate random available slots
  const availableSlots = Math.floor(Math.random() * 10) + 1;
  
  // Generate profile highlights
  const highlights = [
    `${doctor.experience || 0}+ years of experience`,
    `${Math.floor(Math.random() * 10000) + 1000}+ patients consulted`,
    `Speaks ${['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'].slice(0, Math.floor(Math.random() * 3) + 2).join(', ')}`
  ];

  // Generate availability
  const days = ['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const availableDays = days.filter(() => Math.random() > 0.3);
  
  const toggleExpand = () => {
    setExpanded(!expanded);
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleImageError = () => {
    setImageError(true);
  };
  
  // Generate a base price based on doctor's experience and specialties
  const getBasePrice = (doctor: Doctor): number => {
    // Calculate a price based on doctor's experience (min 300, max 2000)
    const experienceMultiplier = Math.min(doctor.experience || 1, 15); // Cap at 15 years for calculation
    const basePrice = 300 + (experienceMultiplier * 100);
    
    // Adjust price based on specialty (some specialties are more expensive)
    const premiumSpecialties = [
      'Cardiologist', 'Neurologist', 'Oncologist', 'Endocrinologist', 
      'Gastroenterologist', 'Dermatologist'
    ];
    
    // Check if doctor has any premium specialties
    const specialtyBonus = doctor.speciality?.some(s => 
      premiumSpecialties.some(ps => s.toLowerCase().includes(ps.toLowerCase()))
    ) ? 500 : 0;
    
    return basePrice + specialtyBonus;
  };

  return (
    <Card 
      className={`p-4 border border-gray-100 hover:shadow-lg transition-all duration-300 ${expanded ? 'shadow-md' : ''}`} 
      data-testid="doctor-card"
    >
      <div className="flex flex-col">
        {/* Main doctor info - always visible */}
        <div className="flex flex-col md:flex-row items-start md:items-center cursor-pointer" onClick={toggleExpand}>
          <div className="relative">
            {imageError ? (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 flex-shrink-0 mb-3 md:mb-0 md:mr-4 overflow-hidden border-2 border-blue-200 p-1 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {doctor.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
            ) : (
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex-shrink-0 mb-3 md:mb-0 md:mr-4 overflow-hidden border-2 border-blue-200">
                <img 
                  src={doctorImage} 
                  alt={doctor.name}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>
            )}
            <button 
              onClick={toggleFavorite} 
              className={`absolute top-0 right-0 rounded-full p-1 ${isFavorite ? 'bg-red-100 text-red-500' : 'bg-gray-100 text-gray-400'}`}
            >
              <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
            </button>
            
            {/* Verified badge */}
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center">
              <div>
                <h3 className="text-xl font-semibold" data-testid="doctor-name">{doctor.name || 'Doctor'}</h3>
                <p className="text-xs text-gray-500">{doctorPrefix}</p>
              </div>
              <div className="flex items-center ml-4 text-sm">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="ml-1 font-medium">{rating}</span>
                <span className="ml-1 text-gray-500">({reviews})</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-1" data-testid="doctor-specialty">
              {doctor.speciality && Array.isArray(doctor.speciality) ? doctor.speciality.join(", ") : 'Specialist'}
            </p>
            
            <div className="flex items-center text-sm text-gray-700 mb-2">
              <Briefcase className="h-4 w-4 mr-1 text-primary" />
              <span data-testid="doctor-experience">{doctor.experience || 0} years experience</span>
              <MapPin className="h-4 w-4 ml-3 mr-1 text-gray-500" />
              <span>2.5 km</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-2">
              {doctor.videoConsult && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                  <Video className="h-3 w-3 mr-1" />
                  Video Consult
                </Badge>
              )}
              {doctor.inClinic && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
                  <Building2 className="h-3 w-3 mr-1" />
                  In Clinic
                </Badge>
              )}
            </div>
          </div>
          
          <div className="border-t mt-4 pt-3 w-full md:border-t-0 md:border-l md:pl-4 md:ml-4 md:mt-0 md:pt-0 md:w-auto">
            <div className="flex flex-col mb-2">
              <div className="text-xs text-gray-500 uppercase font-medium">Consultation fee</div>
              <div className="flex items-baseline">
                <div className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent" data-testid="doctor-fee">
                  ₹{doctor.fee ? doctor.fee : getBasePrice(doctor)}
                </div>
                <span className="ml-1 text-xs text-gray-500">(starting from)</span>
              </div>
              
              {/* Fee comparison badge */}
              <div className="mt-1 inline-flex items-center rounded-full px-2 py-1 text-xs bg-green-50 text-green-700 w-fit">
                <span className="font-semibold">20% off</span>
                <span className="ml-1 line-through text-gray-500">
                  ₹{Math.floor((doctor.fee || getBasePrice(doctor)) * 1.2)}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 mt-2">
              <Button className="bg-primary hover:bg-primary/90 text-white font-semibold">
                Book Appointment
              </Button>
              <div className="flex items-center text-xs text-green-600">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Available today • {availableSlots} slots</span>
              </div>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="ml-2" 
            onClick={toggleExpand}
          >
            {expanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </Button>
        </div>
        
        {/* Expanded details - only visible when expanded */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in fade-in-5 duration-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Award className="h-4 w-4 mr-1 text-primary" />
                  Profile Highlights
                </h4>
                <ul className="space-y-1 text-sm">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <ThumbsUp className="h-3 w-3 mt-1 mr-2 text-green-500" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-primary" />
                  Availability
                </h4>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map((day, index) => (
                    <Badge key={index} variant={day === 'Today' ? 'default' : 'outline'} className="py-1 px-3">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-primary" />
                  Next Available
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm font-medium">Today</span>
                    <span className="text-sm text-primary">10:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm font-medium">Tomorrow</span>
                    <span className="text-sm text-primary">2:00 PM - 6:00 PM</span>
                  </div>
                </div>
                
                {/* Fee comparison */}
                <div className="mt-3 bg-blue-50 p-3 rounded-md">
                  <h5 className="text-sm font-medium text-blue-800 mb-2">Consultation Fees</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Video Consultation</span>
                      <span className="text-blue-700 font-medium">
                        ₹{Math.floor((doctor.fee || getBasePrice(doctor)) * 0.8)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">In-clinic Visit</span>
                      <span className="text-blue-700 font-medium">
                        ₹{doctor.fee || getBasePrice(doctor)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Follow-up Visit</span>
                      <span className="text-blue-700 font-medium">
                        ₹{Math.floor((doctor.fee || getBasePrice(doctor)) * 0.5)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm" className="text-gray-500">
                <Share2 className="h-4 w-4 mr-1" />
                Share Profile
              </Button>
              <Button variant="outline" size="sm" className="text-primary">
                View Full Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
