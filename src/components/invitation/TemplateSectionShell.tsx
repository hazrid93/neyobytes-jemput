import type { CSSProperties, ReactNode } from 'react';
import { getSectionShellStyles } from '../../lib/template-ui';

interface TemplateSectionShellProps {
  templateId: string;
  children: ReactNode;
  padding?: string;
  style?: CSSProperties;
  contentStyle?: CSSProperties;
}

export default function TemplateSectionShell({
  templateId,
  children,
  padding = '28px 24px',
  style,
  contentStyle,
}: TemplateSectionShellProps) {
  const shell = getSectionShellStyles(templateId);

  return (
    <div style={{ ...shell.wrapper, ...style }}>
      <div style={shell.overlay} />
      <div
        style={{
          ...shell.content,
          padding,
          ...contentStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}
