import React from "react";

import "./SideBar.css";
const SideBar = props => {
  var registers = [
    {name : "$zero",val: 0},
    { name: "$at", val: 0 },
    { name: "$v0", val: 0 },
    { name: "$v1", val: 0 },
    { name: "$a0", val: 0 },
    { name: "$a1", val: 0 },
    { name: "$a2", val: 0 },
    { name: "$a3", val: 0 },
    { name: "$t0", val: 0 },
    { name: "$t1", val: 0 },
    { name: "$t2", val: 0 },
    { name: "$t3", val: 0 },
    { name: "$t4", val: 0 },
    { name: "$t5", val: 0 },
    { name: "$t6", val: 0 },
    { name: "$t7", val: 0 },
    { name: "$s0", val: 0 },
    { name: "$s1", val: 0 },
    { name: "$s2", val: 0 },
    { name: "$s3", val: 0 },
    { name: "$s4", val: 0 },
    { name: "$s5", val: 0 },
    { name: "$s6", val: 0 },
    { name: "$s7", val: 0 },
    { name: "$t8", val: 0 },
    { name: "$t9", val: 0 },
    { name: "$k0", val: 0 },
    { name: "$k1", val: 0 },
    { name: "$gp", val: 0 },
    { name: "$sp", val: 0 },
    { name: "$s8", val: 0 },
    { name: "$ra", val: 0 },
    // { name: "zero", val: 0 }
  ];
  return (
    <div className="sidebar">
      <div>
        <div className="register" style={{ height: "50px" }}>
          PC&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;=
          &nbsp;&nbsp;&nbsp;{props.pc}
        </div>
        {
        // var registerArray = [];
        props.registers.map((ele,idx) => {
          console.log("inside props.registers")
          console.log(`ele is ${ele}`);
          console.log(`idx is ${idx}`);
          // console.log(`key is ${key}`);
          // const { name, val } = ele;
          // if (idx < 10) {
            // (
              return (
                <div className="register">
                R&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[
                ${idx}] &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= &nbsp;&nbsp;&nbsp;{ele}
              </div>
              )
            // );
          // }
          // return (
          //   <div className="register">
          //     R&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[{name}]
          //     &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= &nbsp;&nbsp;&nbsp;{val}
          //   </div>
          // );
        })}
      </div>
      <div></div>
    </div>
  );
};

export default SideBar;
