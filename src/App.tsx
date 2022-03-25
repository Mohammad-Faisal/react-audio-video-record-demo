import React from "react";
import "./App.css";
import { Recorder } from "./Recorder";
import { RecorderTimer } from "./RecorderTimer";

function App() {
  return (
    <div className="App">
      <Recorder fileName="random" />
      <RecorderTimer fileName="random" />
    </div>
  );
}

export default App;
