import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { DailySummary } from "../types/weather";
// import { formatTemp } from '../utils/weatherUtils'

interface WeatherVisualizationProps {
  city: string;
  isCelsius: boolean;
}

const metricOptions = [
  { value: "avgTemp", label: "Average Temperature" },
  { value: "maxTemp", label: "Maximum Temperature" },
  { value: "minTemp", label: "Minimum Temperature" },
  { value: "avgHumidity", label: "Average Humidity" },
  { value: "avgWindSpeed", label: "Average Wind Speed" },
];

export const WeatherVisualization: React.FC<WeatherVisualizationProps> = ({
  city,
  isCelsius,
}) => {
  const [selectedMetric, setSelectedMetric] = useState("avgTemp");
  const [summaries, setSummaries] = useState<DailySummary[]>([]);

  const fetchSummaries = async (city: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/summaries/${city}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch daily summaries");
      }
      const data = await response.json();
      setSummaries(data);
    } catch (error) {
      console.error("Error fetching daily summaries:", error);
    }
  };

  useEffect(() => {
    fetchSummaries(city);
  }, [city]);

  const formatTemp = (temp: number) => {
    const temperature = isCelsius ? temp : (temp * 9) / 5 + 32;
    return `${Math.round(temperature)}°${isCelsius ? "C" : "F"}`;
  };

    const formatValue = (value: number, metric: string) => {
    switch (metric) {
      case 'avgTemp':
      case 'maxTemp':
      case 'minTemp':
        return formatTemp(value)
      case 'avgHumidity':
        return `${Math.round(value)}%`
      case 'avgWindSpeed':
        return `${value.toFixed(1)} m/s`
      default:
        return value.toString()
    }
  }

  const sortedData = [...summaries].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  });

  const chartData = sortedData.map((summary) => ({
    date: new Date(summary.date).toLocaleDateString(),
    [selectedMetric]: summary[selectedMetric as keyof DailySummary],
  }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Weather Trends for {city}</CardTitle>
        <Select
          value={selectedMetric}
          onValueChange={(value) => setSelectedMetric(value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            {metricOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            [selectedMetric]: {
              label:
                metricOptions.find((option) => option.value === selectedMetric)
                  ?.label || selectedMetric,
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => formatValue(value, selectedMetric)} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={`var(--color-${selectedMetric})`}
                name={
                  metricOptions.find(
                    (option) => option.value === selectedMetric
                  )?.label
                }
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
