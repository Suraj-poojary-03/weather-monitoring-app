
export const CITIES = [
  "Delhi",
  "Mumbai",
  "Chennai",
  "Bengaluru",
  "Kolkata",
  "Hyderabad",
];
export const convertTemp = (temp: number, isCelsius: boolean): number => {
  return isCelsius ? temp : (temp * 9/5) + 32;
};

export const formatTemp = (temp: number, isCelsius: boolean): string => {
  return `${Math.round(convertTemp(temp, isCelsius))}°${isCelsius ? 'C' : 'F'}`;
};
