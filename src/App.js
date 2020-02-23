import './App.css';
import React, { Component } from 'react';

import IDE from './container/IDE/ide';
import Navbar from './component/navbar/Navbar';
import Console from './component/console/Console'
import SideBar from './component/sidebar/SideBar'

class App extends Component{
  render=()=>{
    return(
      <div className="App">
        <SideBar />
        <div style={{width: '100%'}}>
          <Navbar />
          <IDE/>
          <Console />
        </div>
      </div>
    )
  }
}

export default App;