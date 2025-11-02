import { useState, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import './App.css';
import Editor from '@monaco-editor/react';
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
} from '@/components/ui/menubar';
function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState(
    '// Type your code here\nfunction greet() {\n  console.log("Hello, Monaco!");\n}'
  );
  const [showFileMenu, setShowFileMenu] = useState(true);
  const [fileMenuPosition, setFileMenuPosition] = useState({ x: 0, y: 0 });
  const [encryptionKey, setEncryptionKey] = useState('');
  const editorRef = useRef<any>(null);
  const fileMenuRef = useRef<HTMLDivElement>(null);

  const editorOptions = {
    selectOnLineNumbers: true,
    renderValidationDecorations: 'on',
    automaticLayout: true,
  };

  const handleEditorChange = (value: string | undefined) => {
    setCode(value || '');
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
    console.log('Editor mounted:', editor);
  };

  // Handle clicks outside the file menu to close it
  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       fileMenuRef.current &&
  //       !fileMenuRef.current.contains(event.target as Node)
  //     ) {
  //       // setShowFileMenu(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  // Listen for the Tauri file-drop event to get absolute file paths
  useEffect(() => {
    console.log('in unlisten');
    let unlisten: (() => void) | null = null;
    (async () => {
      console.log('inside unlisten');
      // payload is an array of absolute file paths
      unlisten = (await listen<string[]>('tauri://file-drop', async (event) => {
        const paths = event.payload;
        if (paths && paths.length > 0) {
          const path = paths[0];
          console.log('Dropped absolute path (tauri event):', path);
          try {
            const content = await invoke('read_file', { path });
            setCode(content as string);
          } catch (err) {
            alert('Failed to read file from backend: ' + String(err));
          }
        }
      })) as unknown as () => void;
    })();

    return () => {
      if (unlisten) {
        try {
          unlisten();
        } catch {}
      }
    };
  }, []);

  // Handle editor context menu (right-click)
  const handleContextMenu = (e: any) => {
    e.preventDefault();
    setFileMenuPosition({ x: e.clientX, y: e.clientY });
    setShowFileMenu(true);
  };

  // File menu actions
  const handleNewFile = () => {
    setCode('// New file content\n');
    setShowFileMenu(false);
  };

  const handleOpenFile = async () => {
    try {
      // open returns a string (path) or null when cancelled
      const path = (await open({ multiple: false, directory: false })) as
        | string
        | null;

      if (!path) {
        setShowFileMenu(false);
        return;
      }

      // read file contents in Rust backend
      try {
        const content = await invoke('read_file', { path });
        setCode(content as string);
      } catch (err) {
        alert('Failed to read file from backend: ' + String(err));
      }
    } catch (err) {
      alert('Failed to open file dialog: ' + String(err));
    } finally {
      setShowFileMenu(false);
    }
  };

  const handleSaveFile = () => {
    // In a real app, this would save the current file
    alert('Save File functionality would save the current file');
    setShowFileMenu(false);
  };

  const handleSaveAs = () => {
    // In a real app, this would save as a new file
    alert('Save As functionality would open a save dialog here');
    setShowFileMenu(false);
  };

  const handleCloseFile = () => {
    setCode('');
    setShowFileMenu(false);
  };

  const handleExit = () => {
    // In a real app, this would exit the application
    alert('Exit functionality would close the application');
    setShowFileMenu(false);
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    console.log('Yes');
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    console.log('Yes dropped');
    console.log('e : ' + JSON.stringify(e.dataTransfer.files));
    console.log(' len ' + e.dataTransfer.files.length);

    if (e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0] as any;
      console.log(' file ' + JSON.stringify(file));
      // Tauri exposes a `path` on the File object in the webview.
      // If present, ask the Rust backend to read the file.
      const path: string | undefined = file.path;
      console.log(' path ' + path);
      if (path) {
        try {
          const content = await invoke('read_file', { path });
          setCode(content as string);
        } catch (err) {
          alert('Failed to read file from backend: ' + String(err));
        }
      } else {
        // Fallback: read in frontend (browser FileReader)
        if (
          file.type.startsWith('text/') ||
          file.name.match(/\.(js|ts|jsx|tsx|json|css|html|md)$/i)
        ) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const content = event.target?.result as string;
            console.log(content);
            setCode(content);
          };
          reader.readAsText(file);
        } else {
          alert(
            `Cannot open file: ${file.name}. Only text files are supported.`
          );
        }
      }
    }
  };

  async function greet() {
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <main
      className="container"
      style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          handleOpenFile();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>

      {/* Encryption Key Input */}
      <div style={{ padding: '10px 0' }}>
        <input
          type="password"
          value={encryptionKey}
          onChange={(e) => setEncryptionKey(e.currentTarget.value)}
          placeholder="Enter encryption key..."
          style={{
            padding: '6px 10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            width: '300px',
          }}
        />
      </div>

      {/* Monaco Editor Container */}
      <div
        style={{
          flex: 1,
          border: '1px solid #ccc',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Shadcn File Menu Bar */}
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={handleNewFile}>New</MenubarItem>
              <MenubarItem onClick={handleOpenFile}>Open...</MenubarItem>
              <MenubarItem onClick={handleSaveFile}>Save</MenubarItem>
              <MenubarItem onClick={handleSaveAs}>Save As...</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={handleCloseFile}>Close</MenubarItem>
              <MenubarItem onClick={handleExit}>Exit</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        <Editor
          height="100%"
          defaultLanguage="json"
          value={code}
          theme="light"
          options={editorOptions}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
        />
      </div>
    </main>
  );
}

export default App;
