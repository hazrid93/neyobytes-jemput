import {
  useEffect,
  useState,
  createElement,
  type CSSProperties,
  type FocusEvent,
  type FormEvent,
  type ReactNode,
} from 'react';

interface EditableCopyProps {
  as?: keyof HTMLElementTagNameMap;
  value: string;
  copyKey: string;
  editMode?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function EditableCopy({
  as = 'span',
  value,
  copyKey,
  editMode = false,
  style,
}: EditableCopyProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const postDraft = (nextValue: string) => {
    if (typeof window === 'undefined') return;
    window.dispatchEvent(new CustomEvent('preview-copy-local-change', {
      detail: { copyKey, value: nextValue },
    }));
    window.parent.postMessage({ type: 'preview-copy-draft', copyKey, value: nextValue }, window.location.origin);
  };

  if (!editMode) {
    return createElement(as, { style }, draft);
  }

  return createElement(as, {
    contentEditable: true,
    suppressContentEditableWarning: true,
    style: {
      ...style,
      outline: '1px dashed color-mix(in srgb, var(--secondary-color, #D4AF37) 45%, transparent)',
      outlineOffset: 4,
      borderRadius: 6,
      padding: '2px 4px',
      cursor: 'text',
    },
    onInput: (event: FormEvent<HTMLElement>) => {
      const nextValue = (event.currentTarget as HTMLElement).innerText;
      setDraft(nextValue);
      postDraft(nextValue);
    },
    onBlur: (event: FocusEvent<HTMLElement>) => {
      const nextValue = (event.currentTarget as HTMLElement).innerText;
      setDraft(nextValue);
      postDraft(nextValue);
    },
  }, draft);
}
