import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import HeatMap from "./HeatMap";

function App() {

  // Display total values on heatmap by default, replace with data from single year (start date) or date range based on filter options
  const [displayTotal, setDisplayTotal] = useState(true);
  const [startYear, setStartYear] = useState(NaN);
  const [endYear, setEndYear] = useState(NaN);
  // Specifies whether the map will render data on notification, authorization, or delivery amounts
  const [dataSet, setDataSet] = useState("deliveries")

  return (
    <div className="App">
      <HeatMap
        displayTotal={displayTotal}
        startYear={startYear}
        endYear={endYear}
      />
    </div>
  );
}

export default App;
