import React, { useState, useEffect } from "react";
import Slider from 'react-input-slider';

import "./SideBar.css";
const SideBar = props => {
  // console.log(props.registers)
  // console.log("Memory Used: " + props.memoryUsed)
  var [isOpen, setIsOpen] = useState({
    registers: false,
    dataSegment: false,
    sampleProgram: false,
    analysis: false
  })

  var [isCacheConfShow, setIsCacheConfShow] = useState(false)

  var [cacheNumber, setCacheNumber] = useState(1)

  var registers = []
  props.registers.forEach((val, key) => {
    registers.push({
      name: key,
      val: val
    })
  });

  var dataSegment = []
  for (let i = 0; i < props.memoryUsed; i += 4) {
    var bin = ""
    for (let j = i; j < 4 + i; j++) {
      bin += props.dataSegment[j]
    }
    dataSegment.push({
      dec: parseInt(bin, 2),
      bin: bin
    })
  }
  // console.log(dataSegment)

  var performance = ""
  if(Object.keys(props.performance).length === 0 && props.running === 0){
    performance = <div className="pa-program">Run your assemble code to check performance</div>
  }
  else if(props.running === 1){
    performance = <span className="pa-program">Running...</span>
  }
  else{
    performance = (<div>
      <div className="pa-program">Number of cycles: {props.performance.cycles}</div>
      <div className="pa-program">Number of stalls: {props.performance.stalls}</div>
      <div className="pa-program">IPC: {(1/(1+(props.performance.stalls/props.performance.cycles))).toFixed(2)}</div>
    </div>)
  }
  
  useEffect(() => {
    if(props.isShowing){
      setIsOpen({
        registers: false,
        dataSegment: false,
        sampleProgram: false,
        analysis: false
      })
    }
  }, [props.isShowing])

  useEffect(() => {
    setIsCacheConfShow(props.isShowing)
  }, [props.isShowing])

  useEffect(() => {
    if(isOpen.analysis || isOpen.dataSegment || isOpen.registers || isOpen.sampleProgram){
      setIsCacheConfShow(false)
    }
  }, [isOpen.analysis, isOpen.dataSegment, isOpen.registers, isOpen.sampleProgram])

  const {hideCacheSettings} = props

  useEffect(() => hideCacheSettings(isCacheConfShow), [isCacheConfShow, hideCacheSettings])

  var AssociativityL1 = ""
  if(props.l1CacheInfo.associativity === 0){
    AssociativityL1 = (<span>(Fully Associative)</span>)
  }
  else if(props.l1CacheInfo.associativity === props.l1CacheInfo.cacheSize/props.l1CacheInfo.blockSize){
    AssociativityL1 = (<span>(Direct Mapped)</span>)
  }
  else{
    AssociativityL1 = ""
  }

  var {cacheSize, blockSize, associativity, latency} = props.l1CacheInfo

  var cacheSettingsDisplay = ""

  if(cacheNumber === 1){
    cacheSettingsDisplay = (
      <div className="cache-settings">
        <div className="cache-options">
          <div>Cache Size : {props.l1CacheInfo.cacheSize} Bytes</div>
          <Slider
            axis="x"
            x={props.l1CacheInfo.cacheSize}
            onChange={({ x }) => props.configureCache(1, x, blockSize, associativity, latency)}
            xmin={16}
            xmax={64}
            xstep={Math.pow(2, 4)}
          />
        </div>
        <div className="cache-options">
          <div>Block Size: {props.l1CacheInfo.blockSize} Bytes</div>
          <Slider
            axis="x"
            x={props.l1CacheInfo.blockSize}
            onChange={({ x }) => props.configureCache(1, cacheSize, x, associativity, latency)}
            xmin={4}
            xmax={32}
            xstep={Math.pow(2, 2)}
          />
        </div>
        <div className="cache-options">
          <div>Associativity: {props.l1CacheInfo.associativity} {AssociativityL1}</div>
          <Slider
            axis="x"
            x={props.l1CacheInfo.associativity}
            onChange={({ x }) => props.configureCache(1, cacheSize, blockSize, x, latency)}
            xmin={0}
            xmax={props.l1CacheInfo.cacheSize/props.l1CacheInfo.blockSize}
            xstep={2}
          />
        </div>
        <div className="cache-options">
          <div>Latency: {props.l1CacheInfo.latency}</div>
          <Slider
            axis="x"
            x={props.l1CacheInfo.latency}
            onChange={({ x }) => props.configureCache(1, cacheSize, blockSize, associativity, x)}
            xmin={2}
            xmax={4}
          />
        </div>
      </div>
    )
  }
  else{
    cacheSettingsDisplay = (
      <div>
        <div>Cache Size: L2</div>
        <div>Block Size: L2</div>
        <div>Associativity: L2</div>
        <div>Latency: L2</div>
      </div>
    )
  }

  return (
    <div className="sidebar">
      <div>
        <div
          className="sidebar-options"
          onClick = {() => setIsOpen({
            ...isOpen,
            registers: !isOpen.registers
          })}
        >
          {isOpen.registers ? <i className="fas fa-folder-open"></i> : <i className="fas fa-folder"></i>}
          REGISTERS
        </div>
        <div className="registers" style={isOpen.registers? {display: 'block'} : {display: 'none'}}>
          <div className="register">
            <span className="register_no">PC = </span> <span className="register_val">{props.pc}</span>
          </div>
          {registers.map((ele, idx) => {
            if(idx < 32){ // temporary solution
              const { name, val } = ele;
              if (idx < 10) {
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
              )
            }
            return null
          })}
        </div>
      </div>

      <div>
        <div 
          className="sidebar-options"
          onClick = {() => setIsOpen({
            ...isOpen,
            dataSegment: !isOpen.dataSegment
          })}
        >
          {isOpen.dataSegment ? <i className="fas fa-folder-open"></i> : <i className="fas fa-folder"></i>}
          DATA SEGMENT
          <span style={{ color: 'white', float: 'right', paddingRight: '7px', fontSize: '12px', alignItems: 'center' }}>{props.memoryUsed} bytes/ 4 KB</span>
        </div>
        <div style={isOpen.dataSegment? {display: 'block'} : {display: 'none'}}>
          {
            dataSegment.map((ele, idx) => {
              return (
                <div key={idx} className="data-segment">{ele.dec}&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontSize: "11px" }}>{ele.bin}</span></div>
              )
            })
          }
        </div>
      </div>

      <div>
        <div 
          className="sidebar-options"
          onClick = {() => setIsOpen({
            ...isOpen,
            analysis: !isOpen.analysis
          })}
          >
          {isOpen.analysis ? <i className="fas fa-folder-open"></i> : <i className="fas fa-folder"></i>}
          PERFORMANCE ANALYSIS
        </div>
        <div style={isOpen.analysis? {display: 'block', color: 'white'} : {display: 'none'}}>
          {performance}
        </div>
      </div>

      <div>
        <div 
          className="sidebar-options"
          onClick = {() => setIsOpen({
            ...isOpen,
            sampleProgram: !isOpen.sampleProgram
          })}
          >
          {isOpen.sampleProgram ? <i className="fas fa-folder-open"></i> : <i className="fas fa-folder"></i>}
          SAMPLE PROGRAMS
        </div>
        <div style={isOpen.sampleProgram? {display: 'block'} : {display: 'none'}}>
          <div className="s-program" onClick={() => {props.sampleProgram("bubbleSort")}}><span style={{color:'yellow', fontSize:'11px'}}>asm </span>Bubble Sort</div>
          <div className="s-program" onClick={() => {props.sampleProgram("sumOfNums")}}><span style={{color:'yellow', fontSize:'11px'}}>asm </span>Sum of first 10 natural numbers</div>
          <div className="s-program" onClick={() => {props.sampleProgram("tryOutPipeline")}}><span style={{color:'yellow', fontSize:'11px'}}>asm </span>Try Out Pipeline</div>
        </div>
      </div>

      <div style={isCacheConfShow? {display: 'block', color:'white'}:{display:'none'}} className="cache-counter">
          <div className="cache-headers">
            <span className="cache-labels" style={cacheNumber===1?{backgroundColor: '#696b6a'}:{}}
            onClick={() => setCacheNumber(1)}
            >L1 Cache</span>
            <span className="cache-labels" style={cacheNumber===2?{backgroundColor: '#696b6a'}:{}}
            onClick={() => setCacheNumber(2)}
            >L2 Cache</span>
          </div>
          <div>
            {cacheSettingsDisplay}
          </div>
      </div>
    </div>
  );
};

export default SideBar;
