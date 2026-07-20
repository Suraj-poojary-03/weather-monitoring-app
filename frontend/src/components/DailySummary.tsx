import { DailySummary as DailySummaryType } from '../types/weather';
import { formatTemp } from '../utils/weatherUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from './ui/button';

interface DailySummaryProps {
  dailySummary: DailySummaryType;
  isCelsius: boolean;
}

export const DailySummary: React.FC<DailySummaryProps> = ({ dailySummary, isCelsius }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle><Button variant='outline' size={'lg'}>Daily Summary</Button></CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div>Average Temperature:</div>
            <div>{formatTemp(dailySummary.avgTemp, isCelsius)}</div>
            <div>Maximum Temperature:</div>
            <div>{formatTemp(dailySummary.maxTemp, isCelsius)}</div>
            <div>Minimum Temperature:</div>
            <div>{formatTemp(dailySummary.minTemp, isCelsius)}</div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>Average Humidity:</div>
            <div>{dailySummary.avgHumidity.toFixed(2)}</div>
            <div>Average Wind Speed:</div>
            <div>{dailySummary.avgWindSpeed.toFixed(2)}</div>
            <div>Dominant Condition:</div>
            <div>{dailySummary.dominantCondition}</div>
          </div>
          </div>
      </CardContent>
    </Card>
  );
};
