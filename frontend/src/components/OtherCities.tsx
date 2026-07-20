import { WeatherData } from '../types/weather';
import { formatTemp } from '../utils/weatherUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from './ui/button';

interface OtherCitiesProps {
  otherCitiesData: WeatherData[];
  isCelsius: boolean;
  setCity: (city: string) => void;
}

const WeatherIcon = ({ icon, size }: { icon: string , size: number}) => {
  return <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="Weather Icon" width={size} height={size}/>
};

export const OtherCities: React.FC<OtherCitiesProps> = ({ otherCitiesData, isCelsius, setCity}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Forecast in Other Cities</CardTitle>
      </CardHeader>
      <CardContent>
        {otherCitiesData.map((cityData, index) => (
          <Button key={index} onClick={() => setCity(cityData.name)} variant='outline' size={'lg'} className=' flex justify-between min-w-full min-h-14 mb-5'>
            <div>
              <div className="font-semibold">{cityData.name}</div>
              <div className="text-sm text-gray-500">{cityData.sys.country}</div>
            </div>
            <div className="flex items-center">
              <div className="text-sm text-gray-500 mr-2">{cityData.weather[0].main}</div>
              <WeatherIcon icon={cityData.weather[0].icon} size={50} />
              <span className="ml-2 font-semibold">{formatTemp(cityData.main.temp, isCelsius)}</span>
            </div>
          </Button>

        ))}
      </CardContent>
    </Card>
  );
};
