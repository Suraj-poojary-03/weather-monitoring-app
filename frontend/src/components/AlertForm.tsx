import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

import { CITIES } from "../utils/weatherUtils"

export default function AlertForm() {
  const [city, setCity] = useState('')
  const [threshold, setThreshold] = useState('')
  const [email, setEmail] = useState('')

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/setAlert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ city, threshold: parseFloat(threshold), email }),
      })
      if (response.ok) {
        toast({
          title: "Alert set successfully",
          description: `You will be notified when the temperature in ${city} exceeds ${threshold}°C.`,
        })
      } else {
        throw new Error('Failed to set alert')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set alert. Please try again.",
        variant: "destructive",
      })
      console.log(error)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Set Weather Alert</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="city" className="text-sm font-medium">City</label>
            <Select onValueChange={setCity} required>
              <SelectTrigger id="city">
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                {CITIES.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="threshold" className="text-sm font-medium">Temperature Threshold (°C)</label>
            <Input
              id="threshold"
              type="number"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              required
              min="0"
              max="50"
              step="0.1"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">Set Alert</Button>
        </form>
      </CardContent>
    </Card>
  )
}