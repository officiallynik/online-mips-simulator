import React, { Component } from 'react';
import AceEditor from "react-ace";
import 'brace/mode/mips_assembler';
import 'brace/theme/monokai';

import './ide.css'

let markers = []

class IDE extends Component {

  state = {
    code: ""
  }
  componentDidMount(){
    if(localStorage.getItem('result')){
      this.setState({
        code: localStorage.getItem('result')
      });
    }
  }

  onChange(newValue, e) {
    // console.log('onChange', newValue, e);
    localStorage.setItem('result', String(newValue));
    this.setState({
      code: localStorage.getItem('result')
    });
    // this.render();
  }

  highLightLine = line => {
    console.log("Line: " + line)
    markers = []
    markers.push({
      startRow: line, 
      endRow: line + 1,
      className: 'replacement_marker', 
      type: 'text' 
    })
  }

  render() {
      // console.log(this.editor)
      this.highLightLine(this.props.pc)
      return (
          <div className={"IDE-wrapper"}>
              <AceEditor
                  className={"IDE"}
                  mode="mips_assembler" 
                  theme="monokai"
                  placeholder="//write assembly code here..."
                  fontSize={18} 
                  style={{width: "100%", height: "700px"}}
                  name="mipsIDE" 
                  editorProps={{$blockScrolling: true}}
                  setOptions={{tabSize: 4, wrap: false}}
                  showPrintMargin={false}
                  value = {this.state.code}
                  onChange={this.onChange.bind(this)}
                  markers = {markers}
              />
          </div>
      );
  }

}

export default IDE;