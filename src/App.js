import React from "react";
import Heatmap from "./Heatmap";
import "./App.css";


const App = () => {
  return (
    <div className="App">
      <h1 className="heatmap-title">Music Listening Heatmap (2024)</h1>
      <Heatmap/>
    </div>
  );
};

export default App;
