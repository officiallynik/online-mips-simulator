import React from 'react'
import './Navbar.css';
// import CODE from '../code';
// const fs = require('fs');

class Navbar extends React.Component{
    state = {
        result: ""
    }
    render(){
        var runButton = ""
        if(this.props.running === 1){
            runButton = <span href="#" ><i className="fas fa-spinner" style={{color: "yellow"}}></i> Running</span>
        }
        else if(this.props.running === 2){
            runButton = <span href="#" ><i className="fas fa-check" style={{color: '"yellow'}}></i> Done</span>
        }
        else{
            runButton = <span href="#" ><i className="fas fa-play" style={{color: "yellow"}}></i> Run</span>
        }
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

                    <div className="nav-item nav-buttons" onClick={() => this.props.toggleDF()} style={this.props.dataForw? {backgroundColor: "green"}: {}}> 
                        <span>
                            Data Forward
                        </span>
                    </div>

                    <div className="nav-item nav-buttons" onClick={() => this.props.toggleMS()} style={this.props.moreStats? {backgroundColor: "green"}: {}}> 
                        <span>
                            More Stats
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
                        {runButton}
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