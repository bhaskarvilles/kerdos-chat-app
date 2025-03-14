import { Attachment } from '../types';

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

const MessageEditor: React.FC<MessageEditorProps> = ({ onSubmit }) => {
  const handleSubmit = () => {
    onSubmit({
      text: '',
      formatting: {},
      attachments: []
    });
  };

  return (
    <button onClick={handleSubmit}>
      Submit Message
    </button>
  );
};

export default MessageEditor; 