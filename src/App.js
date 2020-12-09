import React, {useState, useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import HeatMap from "./components/HeatMap/HeatMap";
import Header from "./components/Header/Header";
import Instructions from "./components/Instructions/Instructions";
import RegionChart from "./components/RegionChart/RegionChart";
import FilterUI from "./components/FilterUI/FilterUI"

function App() {

  // Display total values on heatmap by default, replace with data from single year (start date) or date range based on filter options
  const [startYear, setStartYear] = useState(NaN);
  const [endYear, setEndYear] = useState(NaN);
  
  // Specifies whether the map will render data on notification, authorization, or delivery amounts
  const [dataType, setDataType] = useState("deliveries")

  function PropChangeWatch({ startYear, endYear, dataType }){

    useEffect(()=>{
      console.log("In app in useEffect ",  startYear, endYear, dataType);
    }, [startYear, endYear, dataType])

    return(
      <HeatMap
        setStartYear={setStartYear}
        startYear={startYear}
        setEndYear={setEndYear}
        endYear={endYear}
        dataType={dataType}
      />
    )
  }

  
  console.log("In app ",  startYear, endYear, dataType);

  return (
    <div className="App">
      <Header />
      <div className="map-styling">
        <PropChangeWatch startYear={startYear} endYear={endYear} dataType={dataType} />
      </div>
      <FilterUI
        setDataType={setDataType}
        setStartYear={setStartYear}
        setEndYear={setEndYear}
      />
      <Instructions />
      <RegionChart />
    </div>
  );
}

export default App;


// class App extends React.component{

  
//   componentDidMount(){
//   // Display total values on heatmap by default, replace with data from single year (start date) or date range based on filter options
//   const [startYear, setStartYear] = useState(NaN);
//   const [endYear, setEndYear] = useState(NaN);
  
//   // Specifies whether the map will render data on notification, authorization, or delivery amounts
//   const [dataType, setDataType] = useState("deliveries")

  
//   console.log("In app ",  startYear, endYear, dataType);
  
//   render(){
//     return (
//       <div className="App">
//         <Header />
//         <Instructions />
//         <FilterUI
//           setDataType={setDataType}
//           setStartYear={setStartYear}
//           setEndYear={setEndYear}
//         />
//         <div className="map-styling">
//           <HeatMap
//             setStartYear={setStartYear}
//             startYear={startYear}
//             setEndYear={setEndYear}
//             endYear={endYear}
//             dataType={dataType}
//           />
//         </div>
//         <RegionChart />
//       </div>
//     );
// }}
// }