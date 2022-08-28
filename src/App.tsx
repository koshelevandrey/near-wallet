import React from "react";
import {Info, SendPage, HomePage} from './components'


function App() {
  // const handleOnClick = () => {
  //   const queryInfo = { active: true, lastFocusedWindow: true };

  //   chrome.tabs &&
  //     chrome.tabs.query(queryInfo, (tabs) => {
  //       const url = tabs[0].url;

  //       alert(`Your url: ${url}`);
  //     });
  // };

  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          <button
            onClick={handleOnClick}
            style={{ width: "200px", height: "40px" }}
          >
            Alert
          </button>
        </p> */}
      </header>
      {/* <Info/> */}
      {/* <SendPage/> */}
      <HomePage/>
     </div>
  );
}

export default App;
