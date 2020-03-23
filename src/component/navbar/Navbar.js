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
            <nav className="main-nav">
                <div className="leftSide">
                    <div className="brand-icon">
                        <i className="fas fa-microchip"></i>
                    </div>
                    <div className="nav-item nav-buttons upload">
                        <span className="file">
                            Upload
                            <input type="file" name="file" id ="fileInput" accept=".asm" onChange={this.props.setFile.bind(this)} multiple/>
                        </span>
                    </div>
                    <div className="nav-item nav-buttons"> 
                        <span className="file" onClick={this.props.deleteFile.bind(this)} >
                            Clear
                        </span>
                    </div>

                    <div className="nav-item nav-buttons" onClick={() => alert("Refer last option in Side Bar")}>
                        <span>
                            Sample Programs
                        </span>
                    </div>

                    <div className="nav-item nav-buttons" onClick={() => alert("Help section will be available soon")}> 
                        <span>
                            Help
                        </span>
                    </div>

                </div>

                <div className="title" style={{display: 'inline'}}>
                    Mips Simulator
                </div>

                <div className="rightSide" style={{display: 'inline'}}>
                    <span className="nav-item  nav-buttons" onClick={this.props.assemble}>
                        <span href="#" >Assemble</span>
                    </span>
                    <span className="nav-item  nav-buttons" onClick={this.props.execute}>
                        <span href="#" >Run</span>
                    </span>
                    <span className="nav-item  nav-buttons" onClick={this.props.stepRun}>
                         <span href="#" >Step-Run</span>
                    </span>
                </div>
            </nav>
        )
    }
}
export default Navbar;