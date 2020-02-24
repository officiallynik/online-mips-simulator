import React from "react";

import "./SideBar.css";
const SideBar = props => {
  // console.log(props.registers)
  var registers = []
    props.registers.forEach((val, key) => {
      registers.push({
        name: key,
        val: val
      })
    });
  return (
    <div className="sidebar">
      <div>
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
      <div></div>
    </div>
  );
};

export default SideBar;
