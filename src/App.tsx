import React from "react";
import {
  ConfirmationPage,
  TrasactionPage,
  ChooseMethod, 
  BalancePage,
  SendPage, 
  HomePage, 
  Info, 
} from './components'


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
      {/* <Info/> */}
      {/* <SendPage/> */}
      {/* <HomePage/> */}
      {/* <ChooseMethod/> */}
      {/* <BalancePage/> */}
      {/* <ConfirmationPage/> */}
      <TrasactionPage/>
     </div>
  );
}

export default App;
