import React from "react";

import "./SideBar.css";

const SideBar = props => {
  var registers = [
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 },
    { name: "zero", val: 0 }
  ];
  return (
    <div className="sidebar">
      <div>
        <div className="register" style={{ height: "50px" }}>
          PC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=
          &nbsp;&nbsp;&nbsp;0
        </div>
        {registers.map((ele, idx) => {
          const { name, val } = ele;
          if (idx < 10) {
            return (
              <div className="register" key={idx}>
                R{idx}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[
                {name}] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= &nbsp;&nbsp;&nbsp;{val}
              </div>
            );
          }
          return (
            <div className="register" key={idx}>
              R{idx}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[{name}]
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= &nbsp;&nbsp;&nbsp;{val}
            </div>
          );
        })}
      </div>
      <div></div>
    </div>
  );
};

export default SideBar;
