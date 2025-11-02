import { useRef, useState, useCallback } from 'react';
import { Select, Space } from 'antd';
import { Editor, useMonaco } from '@monaco-editor/react';
// Note: If you're not using @monaco-editor/react, you'll need a similar
// way to get the editor instance and the monaco object.

const { Option } = Select;

interface DynamicMonacoEditorProps {
  code: string;
  setCode: (code: string) => void;
}
const DynamicMonacoEditor: React.FC<DynamicMonacoEditorProps> = ({
  code,
  setCode,
}) => {
  const monaco = useMonaco();
  const editorRef = useRef(null);
  const [currentLanguage, setCurrentLanguage] = useState('javascript');

  // Callback to get the editor instance on mount
  const handleEditorDidMount = useCallback((editor: any, monaco: any) => {
    editorRef.current = editor;
  }, []);

  // Handler to change the language
  interface ModelLike {}
  interface EditorLike {
    getModel: () => ModelLike | null;
  }
  interface MonacoLike {
    editor: {
      setModelLanguage: (model: ModelLike, language: string) => void;
    };
  }

  const handleLanguageChange = (newLanguage: string) => {
    if (monaco && editorRef.current) {
      const model = (editorRef.current as unknown as EditorLike).getModel();
      if (model) {
        // This is the core function call
        (monaco as unknown as MonacoLike).editor.setModelLanguage(
          model,
          newLanguage
        );
        setCurrentLanguage(newLanguage);
      }
    }
  };

  const languages = [
    'javascript',
    'typescript',
    'json',
    'html',
    'css',
    'python',
  ];

  return (
    <Editor
      height="90vh"
      language={currentLanguage}
      value={code}
      options={{ selectOnLineNumbers: true }}
      onChange={(v) => setCode(v ?? '')}
      //   editorDidMount={handleEditorDidMount}
    />
  );
};

export default DynamicMonacoEditor;
