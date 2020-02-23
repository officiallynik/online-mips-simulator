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
                                 
                                    <div className="file btn btn-sm btn-primary"   >
                                        Upload
                                        <input type="file" name="file" id ="fileInput" accept=".asm" multiple/>
                                    </div>
                            </div>
                            <div className="nav-item"> 
                                {/* <a className="nav-link" href="#">Upload</a>
                                 */}
                                 
                                    <div className="file btn btn-sm btn-warning" >
                                        Clear
                                    </div>
                            </div>
                        </div>

                        <div className="brand">
                            MIPS SIMULATOR
                        </div>

                        <div className="options">
                            <div className="nav-item">
                                    <a className="nav-link" href="#">Assemble</a>
                                </div>
                                <div className="nav-item">
                                    <a className="nav-link" href="#">Run</a>
                                </div>
                                <div className="nav-item">
                                    <a className="nav-link" href="#">Step-Run</a>
                                </div>
                        </div>
            </nav>
        )
    }
}
export default Navbar;