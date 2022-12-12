import React, { useEffect } from 'react';
import "./App.css"
import Router from "./routes"

function App() {
  const style = {
    container: {
      position: "relative",
      backgroundColor: "rgb(241 245 249)",
      minWidth: "1065px",
      overFlow: "auto",
    },
    footer: {
      position: "fixed",
      bottom: 0,
      left: 0,
      width: "100%",
      height: "1rem",
      backgroundColor: "rgb(96 165 250)",
      zIndex: 40
    }
  }
  
  return (
      <div className="App"
        style={style.container}>
        <Router/>
      </div>
  );
}

export default App;
