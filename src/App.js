import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import HeatMap from "./components/HeatMap/HeatMap";
import Header from "./components/Header/Header";
import Instructions from "./components/Instructions/Instructions";
import RegionChart from "./components/RegionChart/RegionChart";

function App() {

  // Display total values on heatmap by default, replace with data from single year (start date) or date range based on filter options
  const [displayTotal, setDisplayTotal] = useState(true);
  const [startYear, setStartYear] = useState(NaN);
  const [endYear, setEndYear] = useState(NaN);
  
  // Specifies whether the map will render data on notification, authorization, or delivery amounts
  const [dataSet, setDataSet] = useState("deliveries")

  return (
    <div className="App">
      <Header />
      <Instructions />
      <div className="map-styling">
        <HeatMap 
          displayTotal={displayTotal}
          startYear={startYear}
          endYear={endYear}
        />
      </div>
      <RegionChart />
    </div>
  );
}

export default App;
