import React, { useRef, useEffect } from 'react';

export interface HighlightSegment {
  text: string;
  metric: string; // e.g., 'reasoning', 'factual'
}

interface HighlightedTextInputProps {
  value: string;
  highlights: HighlightSegment[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const metricColorMap: Record<string, string> = {
  reasoning: 'bg-blue-100 text-blue-800',
  factual: 'bg-green-100 text-green-800',
  creativity: 'bg-purple-100 text-purple-800',
  conciseness: 'bg-yellow-100 text-yellow-800',
  relevance: 'bg-red-100 text-red-800',
};

export const HighlightedTextInput: React.FC<HighlightedTextInputProps> = ({
  value,
  highlights,
  onChange,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Sync scroll position
  useEffect(() => {
    const textarea = textareaRef.current;
    const highlight = highlightRef.current;

    if (textarea && highlight) {
      const syncScroll = () => {
        highlight.scrollTop = textarea.scrollTop;
        highlight.scrollLeft = textarea.scrollLeft;
      };
      textarea.addEventListener('scroll', syncScroll);
      return () => textarea.removeEventListener('scroll', syncScroll);
    }
  }, []);

  return (
    <div className="relative min-h-[400px] w-full">
      <div
        ref={highlightRef}
        className="absolute inset-0 whitespace-pre-wrap break-words p-4 font-normal text-base overflow-hidden z-0 rounded-md bg-background border border-muted text-muted-foreground"
        style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}
      >
        {highlights.length === 0
          ? value
          : highlights.map((seg, idx) => (
              <span key={idx} className={`${metricColorMap[seg.metric]} rounded px-1`}>
                {seg.text}
              </span>
            ))}
      </div>

      <textarea
        ref={textareaRef}
        className="absolute inset-0 w-full h-full p-4 text-base resize-none bg-transparent z-10 outline-none font-normal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          color: 'transparent', // hides actual text while keeping cursor visible
          caretColor: '#000', // makes cursor visible
        }}
      />
    </div>
  );
};
