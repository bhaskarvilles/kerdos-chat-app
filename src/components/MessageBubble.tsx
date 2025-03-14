import React from 'react';
import { Message } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message
}) => {
  const timestamp = new Date(message.timestamp);
  const timeString = timestamp.toLocaleTimeString();
  const isUser = message.role === 'user';

  const components: Components = {
    code({className, children}) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const isInline = !match;
      return isInline ? (
        <code className="px-1 py-0.5 rounded-md bg-muted-foreground/20">
          {children}
        </code>
      ) : (
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          customStyle={{ margin: 0, borderRadius: '0.375rem' }}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    },
    p({children}) {
      return <p className="mb-2 last:mb-0">{children}</p>;
    },
    ul({children}) {
      return <ul className="list-disc list-inside mb-2">{children}</ul>;
    },
    ol({children}) {
      return <ol className="list-decimal list-inside mb-2">{children}</ol>;
    },
    li({children}) {
      return <li className="mb-1">{children}</li>;
    },
    blockquote({children}) {
      return (
        <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic">
          {children}
        </blockquote>
      );
    }
  };

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-4 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <div className="text-sm prose dark:prose-invert max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={components}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        <div className="text-xs mt-2 opacity-70">{timeString}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
