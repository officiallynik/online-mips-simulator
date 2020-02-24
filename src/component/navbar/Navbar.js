import React from 'react'
import './Navbar.css';
import Swal from 'sweetalert2';
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
                                {/* <a className="nav-link" href="#">Upload</a>
                                 */}
                                 
                                    <div className="file btn btn-sm btn-primary">
                                        Upload
                                        <input type="file" name="file" id ="fileInput" accept=".asm" onChange={this.props.setFile.bind(this)} multiple/>
                                    </div>
                            </div>
                            <div className="nav-item"> 
                                {/* <a className="nav-link" href="#">Upload</a>
                                 */}
                                 
                                    <div className="file btn btn-sm btn-warning" onClick={this.props.deleteFile.bind(this)} >
                                        Clear
                                    </div>
                            </div>
                        </div>

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