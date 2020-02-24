import React from "react";

import "./SideBar.css";

const SideBar = props => {
  // console.log(props.registers)
  // console.log("Memory Used: " + props.memoryUsed)
  var registers = []
    props.registers.forEach((val, key) => {
      registers.push({
        name: key,
        val: val
      })
    });
    
  const registerStyle = props.clicked === "registers"? "btn-success" : "btn-info" 
  const dataStyle = props.clicked === "data-segment"? "btn-success" : "btn-info" 

  var DisplaySideBar = ""
  if(props.clicked === "registers"){
    DisplaySideBar = <div>
      <div className="register" style={{ height: "50px" }}>
        <span className="register_no">PC = </span> <span className="register_val">{props.pc}</span>
      </div>
      {registers.map((ele, idx) => {
        const { name, val } = ele;
        if(idx<10){
          return (
            <div className="register" key={idx}>
              <span className="register_no">R{idx}</span>&nbsp;&nbsp;<span className="register_name">[{name}]</span> = <span className="register_val">{val}</span>
            </div>
          );
        }
        return (
          <div className="register" key={idx}>
            <span className="register_no">R{idx}</span> <span className="register_name">[{name}]</span> = <span className="register_val">{val}</span>
          </div>
        );
      })}
    </div>
  }
  else{
    var dataSegment = []
    for(let i=0; i<props.memoryUsed; i+=4){
      var bin = ""
      for(let j=i; j<4+i; j++){
        bin+=props.dataSegment[j]
      }
      dataSegment.push({
        dec: parseInt(bin, 2),
        bin: bin
      })
    }
    console.log(dataSegment)
    DisplaySideBar = <div>
      <div style={{color: 'white', textAlign: 'center'}}>Memory Used: {props.memoryUsed} bytes/ 4 KB</div>
      {
        dataSegment.map((ele, idx) => {
          return (
          <div id={idx} className="data-segment">{ele.dec}&nbsp;&nbsp;&nbsp;&nbsp;{ele.bin}</div>
          )
        })
      }
    </div>
  }

  return (
    <div className="sidebar">
      <nav className="navbar navbar-expand-sm bg-light sidebar-nav">
        <div className="upload" style={{display: 'contents'}}>
          <div className="nav-item">
            <div className={"file btn btn-sm " + registerStyle} onClick = {() => props.onNavClick("registers")}>
              Registers
            </div>
          </div>
          <div className="nav-item">
            <div
              className={"file btn btn-sm " + dataStyle}
              onClick = {() => props.onNavClick("data-segment")}
            >
              Data Segment
            </div>
          </div>
        </div>
      </nav>

      {DisplaySideBar}
      
    </div>
  );
};

export default SideBar;
