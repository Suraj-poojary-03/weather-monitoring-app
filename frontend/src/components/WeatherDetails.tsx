import { WeatherData } from '../types/weather';
import { Card, CardContent } from "@/components/ui/card";
import { Wind, Droplet, Eye, Cloud } from 'lucide-react';

interface WeatherDetailsProps {
  weatherData: WeatherData;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weatherData }) => {
  return (
    <Card className="col-span-1 bg-green-100">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <Eye className="w-4 h-4 mr-2" />
            <span>Visibility</span>
          </div>
          <span>{weatherData.visibility / 1000}km</span>
          <div className="flex items-center">
            <Droplet className="w-4 h-4 mr-2" />
            <span>Humidity</span>
          </div>
          <span>{weatherData.main.humidity}%</span>
          <div className="flex items-center">
            <Wind className="w-4 h-4 mr-2" />
            <span>Wind</span>
          </div>
          <span>{weatherData.wind.speed}m/s</span>
          <div className="flex items-center">
            <Cloud className="w-4 h-4 mr-2" />
            <span>Cloudiness</span>
          </div>
          <span>{weatherData.clouds.all}%</span>
        </div>
      </CardContent>
    </Card>
  );
};
