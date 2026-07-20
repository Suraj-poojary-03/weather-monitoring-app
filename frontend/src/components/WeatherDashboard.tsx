import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { CurrentWeather } from "./CurrentWeather";
import { WeatherDetails } from "./WeatherDetails";
import { DailySummary } from "./DailySummary";
import { OtherCities } from "./OtherCities";
import { WeatherVisualization } from "./Visualization";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import AlertForm from "./AlertForm";

import moment from "moment";
import { CITIES } from "@/utils/weatherUtils";

import { WeatherData } from "@/types/weather";

export default function WeatherDashboard() {
  const [city, setCity] = useState("Mumbai");
  const [tmp, setTmp] = useState("");
  const [isCelsius, setIsCelsius] = useState(true);
  const [weatherData, setWeatherData] = useState<WeatherData>();
  const [dailySummary, setDailySummary] = useState(null);
  const [otherCitiesData, setOtherCitiesData] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    fetchWeatherData(city);
  }, [city]);

  const fetchWeatherData = async (city: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/weather/${city}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the city name and try again.");
        }
        throw new Error("Failed to fetch weather data");
      }
      const data = await response.json();
      setWeatherData(data);

      fetchDailySummary(city);
      fetchOtherCitiesData();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Failed to fetch weather data. Please try again.");
      }
      console.error("Error fetching weather data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailySummary = async (city: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/summary/${city}`);
      if (!response.ok) {
        throw new Error("Failed to fetch daily summary");
      }
      const data = await response.json();
      setDailySummary(data);
    } catch (error) {
      console.error("Error fetching daily summary:", error);
    }
  };

  const fetchOtherCitiesData = async () => {
    try {
      const promises = CITIES.map((city) =>
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/weather/${city}`).then((res) =>
          res.json()
        )
      );
      const data: WeatherData[] = await Promise.all(promises);
      setOtherCitiesData(data);
    } catch (error) {
      console.error("Error fetching other cities data:", error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (tmp) {
      setCity(tmp);
    }
};

  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="flex justify-center items-center h-screen">
        No weather data available
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-100">
      <nav className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Weather Dashboard</h1>
        <div className="flex items-center">
          <form onSubmit={handleSearch} className="flex mr-4">
            <Input
              name="searchCity"
              type="text"
              placeholder="Search city"
              className="rounded-r-none"
              onChange={(e) => setTmp(e.target.value)}
            />
            <Button
              type="submit"
              variant="outline"
              size="icon"
              className="rounded-l-none"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              {isPopoverOpen ? (
                <Button
                  variant="outline"
                  onClick={() => setIsPopoverOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsPopoverOpen(true)}
                >
                  Set Alert
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              onInteractOutside={(e) => e.preventDefault()}
            >
              <AlertForm />
            </PopoverContent>
          </Popover>

          <Switch
            className="ml-4"
            checked={isCelsius}
            onCheckedChange={toggleTemperatureUnit}
          />
          <span className="ml-2">{isCelsius ? "°C" : "°F"}</span>
        </div>
      </nav>

      <main className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>
              Forecast in {weatherData.name}, {weatherData.sys.country}
            </CardTitle>
            <p>
              {moment
                .unix(Math.floor(Date.now() / 1000))
                .utcOffset(weatherData.timezone / 60)
                .format("YYYY-MM-DD h:mm A")}
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <CurrentWeather weatherData={weatherData} isCelsius={isCelsius} />
              <WeatherDetails weatherData={weatherData} />
              <Card className="col-span-1 bg-purple-100">
                <CardContent className="p-4">
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <span>Sunrise</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {moment
                        .unix(weatherData.sys.sunrise)
                        .utcOffset(weatherData.timezone / 60)
                        .format("h:mm A")}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <span>Sunset</span>
                    </div>
                    <div className="text-xl font-semibold">
                      {moment
                        .unix(weatherData.sys.sunset)
                        .utcOffset(weatherData.timezone / 60)
                        .format("h:mm A")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {dailySummary ? (
              <DailySummary dailySummary={dailySummary} isCelsius={isCelsius} />
            ) : (
              "No summary for this city"
            )}
          </CardContent>
        </Card>
        <OtherCities
          otherCitiesData={otherCitiesData}
          isCelsius={isCelsius}
          setCity={setCity}
        />
      </main>
      <WeatherVisualization city={city} isCelsius={isCelsius} />
    </div>
  );
}
