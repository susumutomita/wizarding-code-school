import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';

/**
 * Props for the EditorPane component
 */
interface EditorPaneProps {
  /** Current code in the editor */
  code: string;
  /** Callback when code changes */
  onChange: (code: string) => void;
  /** Callback when user activity is detected */
  onActivity?: () => void;
  /** List of allowed commands for syntax highlighting and auto-completion */
  allowedCommands?: string[];
  /** Read-only mode */
  readOnly?: boolean;
}

/**
 * EditorPane component that provides a code editor for writing spells
 */
export const EditorPane: React.FC<EditorPaneProps> = ({
  code,
  onChange,
  onActivity,
  allowedCommands = [
    'moveUp',
    'moveDown',
    'moveLeft',
    'moveRight',
    'canMoveUp',
    'canMoveDown',
    'canMoveLeft',
    'canMoveRight',
  ],
  readOnly = false,
}) => {
  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // Set up Monaco editor
  useEffect(() => {
    if (!editorContainerRef.current) return;

    // Configure Monaco with spell casting language features
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // Add custom language definitions for the spell API
    const spellLibrary = `
      /**
       * Moves the wizard one step up
       */
      declare function moveUp(): void;

      /**
       * Moves the wizard one step down
       */
      declare function moveDown(): void;

      /**
       * Moves the wizard one step left
       */
      declare function moveLeft(): void;

      /**
       * Moves the wizard one step right
       */
      declare function moveRight(): void;

      /**
       * Checks if the wizard can move up
       * @returns True if the path is clear, false if there's a wall
       */
      declare function canMoveUp(): boolean;

      /**
       * Checks if the wizard can move down
       * @returns True if the path is clear, false if there's a wall
       */
      declare function canMoveDown(): boolean;

      /**
       * Checks if the wizard can move left
       * @returns True if the path is clear, false if there's a wall
       */
      declare function canMoveLeft(): boolean;

      /**
       * Checks if the wizard can move right
       * @returns True if the path is clear, false if there's a wall
       */
      declare function canMoveRight(): boolean;
    `;

    // Add the spell library to Monaco
    monaco.languages.typescript.javascriptDefaults.addExtraLib(spellLibrary, 'spells.d.ts');

    // Create editor with custom options
    const editor = monaco.editor.create(editorContainerRef.current, {
      value: code,
      language: 'javascript',
      theme: 'vs-dark',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 16,
      lineNumbers: 'on',
      folding: true,
      wordWrap: 'on',
      formatOnType: true,
      readOnly,
      suggestOnTriggerCharacters: true,
      snippetSuggestions: 'inline',
    });

    // Set up autocompletion suggestions
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (_model, position, _context, _token) => {
        const suggestions = allowedCommands.map(command => {
          return {
            label: command,
            kind: monaco.languages.CompletionItemKind.Function,
            insertText: `${command}()`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: `Spell function: ${command}`,
            documentation: `Cast the ${command} spell to move your wizard`,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            },
          };
        });

        // Add control flow suggestions if appropriate for the chapter level
        const controlFlowSuggestions = [
          {
            label: 'while-loop',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'while (${1:condition}) {\n\t${2:// code to repeat}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Create a while loop',
            documentation: 'Repeat code while the condition is true',
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            },
          },
          {
            label: 'if-statement',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: 'if (${1:condition}) {\n\t${2:// code to run if true}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Create an if statement',
            documentation: 'Run code only if the condition is true',
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            },
          },
          {
            label: 'for-loop',
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText:
              'for (let ${1:i} = 0; ${1:i} < ${2:count}; ${1:i}++) {\n\t${3:// code to repeat}\n}',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Create a for loop',
            documentation: 'Repeat code a specific number of times',
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: position.column,
              endColumn: position.column,
            },
          },
        ];

        return {
          suggestions: [...suggestions, ...controlFlowSuggestions],
        };
      },
    });

    // Handle changes
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });

    // Track activity for the hint timer
    if (onActivity) {
      editor.onDidChangeCursorPosition(onActivity);
      editor.onDidChangeCursorSelection(onActivity);
      editor.onKeyUp(onActivity);
    }

    // Store editor reference
    editorRef.current = editor;

    return (): void => {
      editor.dispose();
    };
  }, [allowedCommands, readOnly, code, onChange, onActivity]);

  // Update editor content if code prop changes
  useEffect((): void => {
    if (editorRef.current) {
      const currentValue = editorRef.current.getValue();
      if (code !== currentValue) {
        editorRef.current.setValue(code);
      }
    }
  }, [code]);

  return (
    <div
      ref={editorContainerRef}
      className="editor-container"
      style={{ height: '400px', width: '100%', border: '1px solid #ccc' }}
    />
  );
};
