import logo from './logo.svg';
import './App.css';
import HeatMap from "./HeatMap";
import Header from "./Header";
import Instructions from "./Instructions";

function App() {
  return (
    <div className="App">
      <Header />
      <Instructions />
      <div className="map-styling">
        <HeatMap />
      </div>
    </div>
  );
}

export default App;
