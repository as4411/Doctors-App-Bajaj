/**
 * This file provides utility functions for assigning profile images to doctors
 */

// Array of professional doctor photo URLs
export const doctorImages = [
  'https://img.freepik.com/free-photo/attractive-young-male-nutriologist-lab-coat-smiling-against-white-background_662251-2960.jpg',
  'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg',
  'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-stethoscope-around-neck-standing-with-closed-posture_409827-254.jpg',
  'https://img.freepik.com/free-photo/portrait-smiling-male-doctor_171337-1532.jpg',
  'https://img.freepik.com/free-photo/front-view-smiley-doctor-with-crossed-arms_23-2148863649.jpg',
  'https://img.freepik.com/free-photo/medium-shot-smiley-doctor-with-coat_23-2149355374.jpg',
  'https://img.freepik.com/free-photo/portrait-doctor_144627-39390.jpg',
  'https://img.freepik.com/free-photo/portrait-successful-mid-adult-doctor-with-crossed-arms_1262-12865.jpg',
  'https://img.freepik.com/free-photo/medical-workers-covid-19-vaccination-concept-confident-professional-doctor-female-nurse-blue-scrubs-stethoscope-show-thumbs-up-assure-guarantee-quality-clinic-service_1258-57320.jpg',
  'https://img.freepik.com/free-photo/covid-19-pandemic-coronavirus-outbreak-healthcare-workers-concept-serious-looking-female-doctor-physician-with-stethoscope-working-hospital-during-virus-pointing-fingers-down_1258-71124.jpg',
  'https://img.freepik.com/free-photo/portrait-doctor_144627-39341.jpg',
  'https://img.freepik.com/free-photo/beautiful-young-female-doctor-looking-camera-office_1301-7807.jpg',
  'https://img.freepik.com/free-photo/covid-19-vaccination-campaign-portrait-happy-confident-female-doctor-healthcare-worker-with-syringe-show_1258-85470.jpg',
  'https://img.freepik.com/free-photo/happy-doctor-holding-clipboard-with-patients_1098-2176.jpg',
  'https://img.freepik.com/free-photo/doctor-standing-with-folder-stethoscope_1154-355.jpg',
  'https://img.freepik.com/free-photo/smiling-doctor-portrait_23-2148854097.jpg',
];

/**
 * Get a doctor profile image URL based on the doctor's ID
 * 
 * @param id The doctor's unique identifier
 * @returns A URL to a professional doctor image
 */
export function getDoctorImage(id: string): string {
  // Use the ID to consistently map to the same image
  const idNum = parseInt(id.replace(/\D/g, '').slice(0, 5), 10) || 0;
  const imageIndex = idNum % doctorImages.length;
  return doctorImages[imageIndex];
}

/**
 * Generate gender-appropriate name prefixes (Dr. Ms./Mr.)
 * 
 * @param doctorName The doctor's full name
 * @returns A professional prefix with the last name
 */
export function getDoctorPrefix(doctorName: string): string {
  const nameParts = doctorName.split(' ');
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : doctorName;
  
  // This is a simplified approach - in a real application, we would use
  // actual gender data from the API rather than making assumptions
  const imageIndex = doctorName.length % doctorImages.length;
  const isFemalePhoto = imageIndex % 3 === 1; // Roughly maps female images
  
  const prefix = isFemalePhoto ? 'Dr. Ms.' : 'Dr. Mr.';
  return `${prefix} ${lastName}`;
}