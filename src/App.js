import React, { useState, useEffect } from "react";
import "./App.css";
import HeatMap from "./components/HeatMap/HeatMap";
import Header from "./components/Header/Header";
import Instructions from "./components/Instructions/Instructions";
import RegionChart from "./components/RegionChart/RegionChart";
import FilterUI from "./components/FilterUI/FilterUI";

function App() {
    // Display total values on heatmap by default, replace with data from single year (start date) or date range based on filter options
    const [startYear, setStartYear] = useState(NaN);
    const [endYear, setEndYear] = useState(NaN);

    // Specifies whether the map will render data on notification, authorization, or delivery amounts
    const [dataType, setDataType] = useState("deliveries");

    // Set state for window height and width to re-render on browser-window size change
    const [dimensions, setDimensions] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    // Watches for changes in props passed to HeatMap.js and browser changes to stimulate re-render
    function PropAndWindowChangeWatch({ startYear, endYear, dataType }) {
        function handleResize() {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        useEffect(() => {
            console.log("In app in useEffect ", startYear, endYear, dataType);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }, [startYear, endYear, dataType]);

        return (
            <HeatMap
                setStartYear={setStartYear}
                startYear={startYear}
                setEndYear={setEndYear}
                endYear={endYear}
                dataType={dataType}
            />
        );
    }

    console.log("In app ", startYear, endYear, dataType);

    return (
        <div className="App">
            <Header />
            <div className="map-styling">
                <PropAndWindowChangeWatch
                    startYear={startYear}
                    endYear={endYear}
                    dataType={dataType}
                />
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
