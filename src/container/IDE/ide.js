import React, { Component } from 'react';
import AceEditor from "react-ace";
import 'brace/mode/mips_assembler';
import 'brace/theme/tomorrow_night';

import './ide.css'

let warning = []

class IDE extends Component {
  onChange(newValue, e) {
    // console.log('onChange', newValue, e);
    this.props.onCodeChange(String(newValue))
  }

  render() {
      return (
          <div className={"IDE-wrapper"}>
              <AceEditor
                  className={"IDE"}
                  mode="mips_assembler" 
                  theme="tomorrow_night"
                  placeholder="//write assembly code here..."
                  fontSize={18} 
                  style={{width: "100%", height: "665px"}}
                  name="mipsIDE" 
                  editorProps={{$blockScrolling: true}}
                  setOptions={{tabSize: 4, wrap: false}}
                  showPrintMargin={false}
                  value = {this.props.code}
                  onChange={this.onChange.bind(this)}
                  annotations = {warning}
                  enableBasicAutocompletion
              />
          </div>
      );
  }

}

export default IDE;