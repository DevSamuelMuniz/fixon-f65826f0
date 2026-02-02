import { useState, useRef, useCallback, useEffect } from 'react';
import { AtSign, Hash, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface MentionSuggestion {
  user_id: string;
  display_name: string;
}

interface RichTextInputProps {
  value: string;
  onChange: (value: string, mentions: string[]) => void;
  placeholder?: string;
  className?: string;
  minHeight?: string;
  disabled?: boolean;
  error?: boolean;
}

export function RichTextInput({
  value,
  onChange,
  placeholder,
  className,
  minHeight = '100px',
  disabled = false,
  error = false,
}: RichTextInputProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [suggestions, setSuggestions] = useState<MentionSuggestion[]>([]);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionedUsers, setMentionedUsers] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Extract mentions from text
  const extractMentions = useCallback((text: string): string[] => {
    const mentionRegex = /@(\w+)/g;
    const matches = text.match(mentionRegex);
    return matches ? matches.map(m => m.slice(1)) : [];
  }, []);

  // Search for users to mention
  const searchUsers = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles_public')
        .select('user_id, display_name')
        .ilike('display_name', `%${query}%`)
        .limit(5);

      if (error) throw error;
      setSuggestions(data || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setSuggestions([]);
    }
  }, []);

  // Handle text change
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    const cursor = e.target.selectionStart;
    setCursorPosition(cursor);

    // Check if user is typing a mention
    const textBeforeCursor = newValue.slice(0, cursor);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);

    if (mentionMatch) {
      setShowMentions(true);
      setMentionQuery(mentionMatch[1]);
      searchUsers(mentionMatch[1]);
    } else {
      setShowMentions(false);
      setMentionQuery('');
    }

    // Extract all mentions and update
    const mentions = extractMentions(newValue);
    setMentionedUsers(mentions);
    onChange(newValue, mentions);
  };

  // Insert mention
  const insertMention = (user: MentionSuggestion) => {
    if (!textareaRef.current) return;

    const textBeforeCursor = value.slice(0, cursorPosition);
    const textAfterCursor = value.slice(cursorPosition);
    
    // Find where the @ started
    const mentionStart = textBeforeCursor.lastIndexOf('@');
    const beforeMention = value.slice(0, mentionStart);
    
    const newText = `${beforeMention}@${user.display_name} ${textAfterCursor}`;
    const newMentions = extractMentions(newText);
    
    setMentionedUsers(newMentions);
    onChange(newText, newMentions);
    setShowMentions(false);
    setMentionQuery('');
    
    // Focus back on textarea
    setTimeout(() => textareaRef.current?.focus(), 0);
  };

  // Insert hashtag helper
  const insertHashtag = () => {
    if (!textareaRef.current) return;
    
    const cursor = textareaRef.current.selectionStart;
    const before = value.slice(0, cursor);
    const after = value.slice(cursor);
    const newValue = `${before}#${after}`;
    
    onChange(newValue, mentionedUsers);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(cursor + 1, cursor + 1);
      }
    }, 0);
  };

  // Insert mention helper
  const insertMentionSymbol = () => {
    if (!textareaRef.current) return;
    
    const cursor = textareaRef.current.selectionStart;
    const before = value.slice(0, cursor);
    const after = value.slice(cursor);
    const newValue = `${before}@${after}`;
    
    setCursorPosition(cursor + 1);
    setShowMentions(true);
    setMentionQuery('');
    onChange(newValue, mentionedUsers);
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(cursor + 1, cursor + 1);
      }
    }, 0);
  };

  return (
    <div className="relative">
      {/* Toolbar */}
      <div className="flex items-center gap-1 mb-2">
        <button
          type="button"
          onClick={insertMentionSymbol}
          disabled={disabled}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Mencionar usuário"
        >
          <AtSign className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={insertHashtag}
          disabled={disabled}
          className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Adicionar hashtag"
        >
          <Hash className="h-4 w-4" />
        </button>
      </div>

      {/* Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{ minHeight }}
        className={cn(
          'resize-none',
          error && 'border-destructive focus-visible:ring-destructive',
          className
        )}
      />

      {/* Mention Suggestions */}
      {showMentions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-64 bg-popover border border-border rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 text-xs text-muted-foreground border-b border-border">
            Mencionar usuário
          </div>
          <div className="max-h-48 overflow-y-auto">
            {suggestions.map((user) => (
              <button
                key={user.user_id}
                type="button"
                onClick={() => insertMention(user)}
                className="w-full px-3 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
              >
                <AtSign className="h-3 w-3 text-primary" />
                <span>{user.display_name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Mentioned users preview */}
      {mentionedUsers.length > 0 && (
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Mencionados:</span>
          {mentionedUsers.map((name, i) => (
            <span 
              key={i} 
              className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
            >
              @{name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Helper component to render text with highlighted mentions and hashtags
interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export function RichTextDisplay({ content, className }: RichTextDisplayProps) {
  // Parse and highlight mentions and hashtags
  const renderContent = () => {
    const parts = content.split(/(@\w+|#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        return (
          <span key={index} className="text-primary font-medium hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      if (part.startsWith('#')) {
        return (
          <span key={index} className="text-purple-500 font-medium hover:underline cursor-pointer">
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className={cn('whitespace-pre-wrap leading-relaxed', className)}>
      {renderContent()}
    </div>
  );
}
