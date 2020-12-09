import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import HeatMap from "./components/HeatMap/HeatMap";
import Header from "./components/Header/Header";
import Instructions from "./components/Instructions/Instructions";
import RegionChart from "./components/RegionChart/RegionChart";
import FilterUI from "./components/FilterUI/FilterUI"

function App() {

  // Display total values on heatmap by default, replace with data from single year (start date) or date range based on filter options
  const [displayTotal, setDisplayTotal] = useState(true);
  const [startYear, setStartYear] = useState(NaN);
  const [endYear, setEndYear] = useState(NaN);
  
  // Specifies whether the map will render data on notification, authorization, or delivery amounts
  const [dataType, setDataType] = useState("deliveries")
  
  console.log("In app ",  startYear, endYear);

  return (
    <div className="App">
      <Header />
      <Instructions />
      <FilterUI
        setDataType={setDataType}
        setStartYear={setStartYear}
        setEndYear={setEndYear}
      />
      <div className="map-styling">
        <HeatMap 
          displayTotal={displayTotal}
          setStartYear={setStartYear}
          startYear={startYear}
          setEndYear={setEndYear}
          endYear={endYear}
        />
      </div>
      <RegionChart />
    </div>
  );
}

export default App;
