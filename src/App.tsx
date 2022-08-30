import React, {Suspense} from "react";
// import {
//   BrowserRouter as Router,
//   Navigate,
//   Route,
//   Routes,
// } from 'react-router-dom';
// import { initRoutes, routes } from './modules/router';
import {HomePage} from './components'
import {Link, Router} from 'react-chrome-extension-router'

// const redirect = <Route path="*" element={<Navigate to={routes[0].path} />} />;



function App() {
  return (
    // <Router>
    // <Suspense fallback={<div>Page is loading...</div>}>
    //  <Routes>
    //    {initRoutes()}
    //    {redirect}
    //   </Routes>
    //  </Suspense>
    // </Router>
    <Router>
      <HomePage/>
    </Router>
      
  );
}

export default App;
