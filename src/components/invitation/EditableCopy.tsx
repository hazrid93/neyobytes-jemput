import {
  useEffect,
  useRef,
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
  copyKey?: string;
  fieldKey?: string;
  editMode?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}

export default function EditableCopy({
  as = 'span',
  value,
  copyKey,
  fieldKey,
  editMode = false,
  style,
}: EditableCopyProps) {
  const [draft, setDraft] = useState(value);
  const elementRef = useRef<HTMLElement | null>(null);
  const draftKey = fieldKey || copyKey;
  const draftKind: 'copy' | 'field' = fieldKey ? 'field' : 'copy';

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    const element = elementRef.current;
    if (!editMode || !element) return;

    if (typeof document !== 'undefined' && document.activeElement === element) {
      return;
    }

    if (element.innerText !== value) {
      element.innerText = value;
    }
  }, [editMode, value]);

  const postDraft = (nextValue: string) => {
    if (typeof window === 'undefined' || !draftKey) return;
    window.dispatchEvent(new CustomEvent('preview-edit-local-change', {
      detail: { kind: draftKind, key: draftKey, value: nextValue },
    }));
    window.parent.postMessage(
      { type: 'preview-edit-draft', kind: draftKind, key: draftKey, value: nextValue },
      window.location.origin,
    );
  };

  if (!editMode) {
    return createElement(as, { style }, draft);
  }

  return createElement(as, {
    ref: elementRef,
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
  }, null);
}
