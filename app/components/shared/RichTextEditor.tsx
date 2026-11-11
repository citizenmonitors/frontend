"use client";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";

type Props = {
  /** HTML */
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  /** Minimum editor height in px */
  minHeight?: number;
};

/**
 * Word-processor style editor that outputs HTML. Pasting from Google Docs or
 * Word keeps headings, bold, lists and links.
 */
export default function RichTextEditor({ value, onChange, placeholder, minHeight = 280 }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: "news-insight-content rich-text-editor__content",
        style: `min-height:${minHeight}px`,
      },
    },
    onUpdate: ({ editor }) => onChange(editor.isEmpty ? "" : editor.getHTML()),
  });

  // Follow outside changes (e.g. the form being cleared after saving)
  useEffect(() => {
    if (!editor) return;
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (value !== current) editor.commands.setContent(value || "", false);
  }, [editor, value]);

  return (
    <div className="rich-text-editor overflow-hidden rounded-lg border border-gray-300 bg-white focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return <div className="h-[41px] border-b border-gray-200 bg-gray-50" />;

  const chain = () => editor.chain().focus();

  function setLink() {
    const previous = editor!.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link address", previous ?? "https://");
    if (url === null) return;
    if (!url.trim() || url.trim() === "https://") {
      chain().extendMarkRange("link").unsetLink().run();
      return;
    }
    const href = /^(https?:|mailto:)/i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
    chain().extendMarkRange("link").setLink({ href }).run();
  }

  const groups: Array<Array<{ label: React.ReactNode; title: string; active?: boolean; disabled?: boolean; run: () => void }>> = [
    [
      { label: "Text", title: "Normal text", active: editor.isActive("paragraph"), run: () => chain().setParagraph().run() },
      { label: "H2", title: "Heading", active: editor.isActive("heading", { level: 2 }), run: () => chain().toggleHeading({ level: 2 }).run() },
      { label: "H3", title: "Subheading", active: editor.isActive("heading", { level: 3 }), run: () => chain().toggleHeading({ level: 3 }).run() },
    ],
    [
      { label: <b>B</b>, title: "Bold", active: editor.isActive("bold"), run: () => chain().toggleBold().run() },
      { label: <i>I</i>, title: "Italic", active: editor.isActive("italic"), run: () => chain().toggleItalic().run() },
      { label: <u>U</u>, title: "Underline", active: editor.isActive("underline"), run: () => chain().toggleUnderline().run() },
      { label: <s>S</s>, title: "Strikethrough", active: editor.isActive("strike"), run: () => chain().toggleStrike().run() },
    ],
    [
      { label: "• List", title: "Bulleted list", active: editor.isActive("bulletList"), run: () => chain().toggleBulletList().run() },
      { label: "1. List", title: "Numbered list", active: editor.isActive("orderedList"), run: () => chain().toggleOrderedList().run() },
      { label: "“ Quote", title: "Quote", active: editor.isActive("blockquote"), run: () => chain().toggleBlockquote().run() },
      { label: "Link", title: "Add or remove link", active: editor.isActive("link"), run: setLink },
      { label: "—", title: "Divider", run: () => chain().setHorizontalRule().run() },
    ],
    [
      { label: "↶", title: "Undo", disabled: !editor.can().undo(), run: () => chain().undo().run() },
      { label: "↷", title: "Redo", disabled: !editor.can().redo(), run: () => chain().redo().run() },
    ],
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5">
      {groups.map((group, i) => (
        <div key={i} className="flex items-center gap-0.5 border-r border-gray-200 pr-1 last:border-r-0">
          {group.map((button) => (
            <button
              key={button.title}
              type="button"
              title={button.title}
              aria-label={button.title}
              aria-pressed={button.active}
              disabled={button.disabled}
              onMouseDown={(e) => e.preventDefault()}
              onClick={button.run}
              className={`min-w-[30px] rounded px-2 py-1 text-sm leading-none transition-colors disabled:opacity-40 ${
                button.active ? "bg-brand-100 text-brand-800" : "text-gray-700 hover:bg-gray-200"
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
