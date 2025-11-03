import { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';

interface DynamicMonacoEditorProps {
  code: string;
  setCode: (code: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

const DynamicMonacoEditor: React.FC<DynamicMonacoEditorProps> = ({
  code,
  setCode,
  language,
  setLanguage,
}) => {
  // Update currentLanguage when language prop changes
  useEffect(() => {
    setLanguage(language || 'plaintext');
  }, [language]);

  return (
    <Editor
      height="90vh"
      language={language}
      value={code}
      options={{ selectOnLineNumbers: true }}
      onChange={(v) => {
        setCode(v ?? '');
      }}
    />
  );
};

export default DynamicMonacoEditor;
