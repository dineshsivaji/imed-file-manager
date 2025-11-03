import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import TopLevelMenu from './components/ui/TopLevelMenu';
import DynamicMonacoEditor from './components/ui/DynamicMonacoEditor';
import { getCurrentWindow } from '@tauri-apps/api/window';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState<string | null>(''); // editor content state
  const [language, setLanguage] = useState(''); // editor language state

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke('read_file_content', { path: name }));
  }

  // Function to update the title
  async function updateAppTitle(newTitle: string) {
    try {
      const appWindow = getCurrentWindow();
      await appWindow.setTitle(newTitle);
      console.log(`Title updated to: ${newTitle}`);
    } catch (error) {
      console.error('Failed to set window title:', error);
    }
  }
  async function openFileDialog() {
    try {
      type FileReadResult = {
        content: string;
        language: string;
        file_name: string;
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
      updateAppTitle('imed-file-manager - ' + response.file_name);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }
  async function closeFile() {
    setCode('');
    setLanguage('');
    updateAppTitle('imed-file-manager');
  }

  return (
    <div>
      <TopLevelMenu onOpenFile={openFileDialog} onCloseFile={closeFile} />
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
