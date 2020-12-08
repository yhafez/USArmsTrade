import logo from "./logo.svg";
import "./App.css";
import HeatMap from "./components/HeatMap/HeatMap";
import Header from "./components/Header/Header";
import Instructions from "./components/Instructions/Instructions";
import RegionChart from "./components/RegionChart/RegionChart";

function App() {
  return (
    <div className="App">
      <Header />
      <Instructions />
      <div className="map-styling">
        <HeatMap />
      </div>
      <RegionChart />
    </div>
  );
}

export default App;
