import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import Editor from '@monaco-editor/react';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState<string | null>('{}'); // editor content state

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('read_file_content', { path: name }));
  }

  async function openFileDialog() {
    try {
      const content = await invoke<string | null>('choose_and_read_file');
      console.log(content);
      setCode(content);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  return (
    <main className="container">
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          openFileDialog();
        }}
      >
        <button type="submit">Open</button>
      </form>
      <p>{greetMsg}</p>
      {/*<FileTree path="/Users/hgd469/Downloads" />*/}
      <Editor
        height="90vh"
        defaultLanguage="json"
        value={code || ''}
        onChange={(v) => setCode(v ?? '')}
        theme="light"
      />
    </main>
  );
}

export default App;
