import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import TopLevelMenu from './components/ui/TopLevelMenu';
import DynamicMonacoEditor from './components/ui/DynamicMonacoEditor';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState<string | null>(''); // editor content state
  const [language, setLanguage] = useState(''); // editor language state

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('read_file_content', { path: name }));
  }

  async function openFileDialog() {
    try {
      type FileReadResult = {
        content: string;
        language: string;
      };

      const response = await invoke<FileReadResult | null>(
        'choose_and_read_file'
      );
      if (response === null) {
        console.log('No file selected or file read error.');
        return;
      }
      console.log(JSON.stringify(response));
      setCode(response.content);
      setLanguage(response.language);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }
  async function closeFile() {
    setCode('');
    setLanguage('');
  }

  return (
    <div>
      <TopLevelMenu onOpenFile={openFileDialog} onCloseFile={closeFile} />
      {/* <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          openFileDialog();
        }}
      >
        <button type="submit">Open</button>
      </form> */}
      {/* <p>{greetMsg}</p> */}
      {/*<FileTree path="/Users/hgd469/Downloads" />*/}
      {/* <Editor
        height="90vh"
        defaultLanguage="json"
        value={code || ''}
        onChange={(v) => setCode(v ?? '')}
        theme="light"
      /> */}
      <DynamicMonacoEditor
        code={code || ''}
        setCode={setCode}
        language={language}
        setLanguage={setLanguage}
      />
    </div>
  );
}

export default App;
