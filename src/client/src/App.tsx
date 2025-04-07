import React from 'react';
import logo from './logo.svg';
import './App.css';

import CSVTable from './components/CSVTable';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <div className="App">
      <Navbar/>
      <CSVTable />
    </div>
  );
}

export default App;
