import React from 'react'
import './Navbar.css';
// import CODE from '../code';
// const fs = require('fs');

class Navbar extends React.Component{
    state = {
        result: ""
    }
    render(){
        return ( 
            <nav className="navbar navbar-expand-sm bg-light">
                        <div className = "upload">
                            <div className="nav-item">
                                    <div className="file btn btn-sm btn-primary">
                                        Upload
                                        <input type="file" name="file" id ="fileInput" accept=".asm" onChange={this.props.setFile.bind(this)} multiple/>
                                    </div>
                            </div>
                            <div className="nav-item"> 
                                    <div className="file btn btn-sm btn-warning" onClick={this.props.deleteFile.bind(this)} >
                                        Clear
                                    </div>
                            </div>   
                        </div>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Sample Programs
                            </a>
                            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a className="dropdown-item" href="#" onClick={() => {this.props.sampleProgram("bubbleSort")}}>Bubble Sort</a>
                                <a className="dropdown-item" href="#" onClick={() => {this.props.sampleProgram("sumOfNums")}}>Sum of first 10 natural numbers</a>
                            </div>
                        </li>

                        <div className="brand">
                            MIPS SIMULATOR
                        </div>

                        <div className="options">
                            <div className="nav-item">
                                    <a className="nav-link" href="#" onClick={this.props.assemble}>Assemble</a>
                                </div>
                                <div className="nav-item">
                                    <a className="nav-link" href="#" onClick={this.props.execute}>Run</a>
                                </div>
                                <div className="nav-item">
                                    <a className="nav-link" href="#" onClick={this.props.stepRun}>Step-Run</a>
                                </div>
                        </div>
            </nav>
        )
    }
}
export default Navbar;