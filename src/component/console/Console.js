import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import './Console.css'

const Console = props => {
    function editorDidMount(editor, monaco) {
        console.log('editorDidMount', editor);
        editor.focus();
    }
    
    function onChange(newValue, e) {
        console.log('onChange', newValue, e);
    }

    const options = {
        selectOnLineNumbers: true,
        textAlign:"initial"
    };

    return (
        <div className="console-screen">
            <div className="console"></div>
            <MonacoEditor
                width="100%"
                height="219"
                language="mips"
                theme="vs-dark"
                value="//Console..."
                options={options}
                onChange={onChange}
                editorDidMount={editorDidMount}
            />
        </div>    
        
    )
}

export default Console