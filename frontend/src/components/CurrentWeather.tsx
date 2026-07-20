import { WeatherData } from '../types/weather';
import { formatTemp } from '../utils/weatherUtils';
import { Card, CardContent } from "@/components/ui/card";

interface CurrentWeatherProps {
  weatherData: WeatherData;
  isCelsius: boolean;
}

const WeatherIcon = ({ icon, size }: { icon: string , size: number}) => {
  return <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="Weather Icon" width={size} height={size}/>
};

export const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weatherData, isCelsius }) => {
  return (
    <Card className="col-span-1 bg-blue-100">
      <CardContent className="p-4 ">
        <div className="text-4xl font-bold mb-2">{formatTemp(weatherData.main.temp, isCelsius)}</div>
        <div className="flex items-center">
          <WeatherIcon icon={weatherData.weather[0].icon} size={50} />
          <span className="ml-2">{weatherData.weather[0].main}</span>
        </div>
        <div>Feels like {formatTemp(weatherData.main.feels_like, isCelsius)}</div>
      </CardContent>
    </Card>
  );
};
