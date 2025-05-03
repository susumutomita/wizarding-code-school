import React from 'react';
import Editor from '@monaco-editor/react';

/**
 * EditorPane component that provides a Monaco code editor
 *
 * @param code - Current code content to display
 * @param onChange - Callback function when code changes
 * @returns EditorPane component
 */
interface EditorPaneProps {
  /** Current code content to display */
  code: string;
  /** Callback function when code changes */
  onChange: (value: string) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({ code, onChange }) => {
  /**
   * Handles editor value change events
   *
   * @param value - New code value or undefined
   */
  const handleEditorChange = (value: string | undefined): void => {
    if (value !== undefined) {
      onChange(value);
    }
  };

  return (
    <div style={{ height: '40vh', width: '100%', border: '1px solid #ccc' }}>
      <Editor
        height="100%"
        language="javascript"
        value={code}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};
