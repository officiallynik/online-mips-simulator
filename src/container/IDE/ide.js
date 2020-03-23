import React, { Component } from 'react';
import AceEditor from "react-ace";
import 'brace/mode/mips_assembler';
import 'brace/theme/tomorrow_night';

import './ide.css'

let warning = []

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
    warning = [{
      row: line, 
      type: 'warning',
      text: 'here'
    }]
  }

  render() {
      // console.log(this.editor)
      var lineNum = this.props.pc
      this.highLightLine(lineNum)

      return (
          <div className={"IDE-wrapper"}>
              <AceEditor
                  className={"IDE"}
                  mode="mips_assembler" 
                  theme="tomorrow_night"
                  placeholder="//write assembly code here..."
                  fontSize={18} 
                  style={{width: "100%", height: "700px"}}
                  name="mipsIDE" 
                  editorProps={{$blockScrolling: true}}
                  setOptions={{tabSize: 4, wrap: false}}
                  showPrintMargin={false}
                  value = {this.state.code}
                  onChange={this.onChange.bind(this)}
                  annotations = {warning}
              />
          </div>
      );
  }

}

export default IDE;