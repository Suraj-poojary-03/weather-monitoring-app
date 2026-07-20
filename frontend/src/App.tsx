import WeatherDashboard from './components/WeatherDashboard'
import { Toaster } from './components/ui/toaster'
function App() {

  return (
    <div className="App">
      <Toaster />
      <WeatherDashboard />
    </div>
  )
}

export default App
