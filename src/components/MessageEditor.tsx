interface MessageEditorProps {
  onSubmit: (content: MessageContent) => void;
}

interface MessageContent {
  text: string;
  formatting: {
    bold?: [number, number][];
    italic?: [number, number][];
    code?: [number, number][];
  };
  attachments: Attachment[];
} 