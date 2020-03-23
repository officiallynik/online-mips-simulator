import React from 'react';
import './Console.css'
import AceEditor from "react-ace";
import 'brace/theme/tomorrow_night';

const Console = props => {
    return (
        <div className={"console-wrapper"}>
            <AceEditor
                className={"console"}
                theme="tomorrow_night"
                fontSize={14} 
                style={{width: "100%", height: "230px"}}
                name="console" 
                editorProps={{$blockScrolling: true}}
                setOptions={{tabSize: 4, wrap: false}}
                showPrintMargin={false}
                value = {props.console}
                readOnly
            />
        </div>
    );
}

export default Console