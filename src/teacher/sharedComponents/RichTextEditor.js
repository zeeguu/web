import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import * as s from "../styledComponents/TitleInput.sc";
import styled from "styled-components";

const StyledEditorWrapper = styled.div`
  background-color: white;
  border-radius: 4px;
  border: 1px solid #ccc;

  .ProseMirror {
    min-height: 400px;
    padding: 12px;
    outline: none;

    h1, h2, h3 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
    }

    h1:first-child, h2:first-child, h3:first-child {
      margin-top: 0;
    }

    p {
      margin-top: 0;
      margin-bottom: 1em;
    }

    p:last-child {
      margin-bottom: 0;
    }

    ul, ol {
      margin-top: 0;
      margin-bottom: 1em;
      padding-left: 1.5em;
    }

    ul:last-child, ol:last-child {
      margin-bottom: 0;
    }

    /* Blockquote styling - match reader appearance */
    blockquote {
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      font-style: normal;
    }

    blockquote p {
      margin: 0;
      margin-left: 2em;
      padding: 1em 1.5em;
      border-left: 4px solid #ff8c00;
      background-color: #f9f9f9;
      font-style: italic;
      position: relative;
    }

    /* First paragraph in blockquote gets top margin and quote mark */
    blockquote p:first-child {
      margin-top: 1.5em;
    }

    blockquote p:first-child::before {
      content: '"';
      font-size: 3em;
      color: #ff8c00;
      position: absolute;
      left: 0.2em;
      top: -0.1em;
      opacity: 0.3;
    }

    /* Last paragraph in blockquote gets bottom margin */
    blockquote p:last-child {
      margin-bottom: 1.5em;
    }
  }

  .toolbar {
    border-bottom: 1px solid #ccc;
    padding: 8px;
    display: flex;
    gap: 4px;
    flex-wrap: wrap;

    button {
      padding: 6px 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 3px;
      cursor: pointer;
      font-size: 14px;

      &:hover {
        background: #f5f5f5;
      }

      &.is-active {
        background: #e0e0e0;
        border-color: #999;
      }
    }
  }
`;

export const RichTextEditor = ({ value, onChange, name, placeholder, children }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      const syntheticEvent = {
        target: {
          name: name,
          value: html,
        },
      };
      onChange(syntheticEvent);
    },
  });

  // Update content when value prop changes
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  if (!editor) {
    return null;
  }

  return (
    <s.LabeledInputFields>
      <div className="input-container">
        <label htmlFor={name}>{children}</label>
        <StyledEditorWrapper>
          <div className="toolbar">
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
            >
              H3
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "is-active" : ""}
            >
              Bold
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "is-active" : ""}
            >
              Italic
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive("bulletList") ? "is-active" : ""}
            >
              Bullet List
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={editor.isActive("orderedList") ? "is-active" : ""}
            >
              Ordered List
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive("blockquote") ? "is-active" : ""}
            >
              Quote
            </button>
          </div>
          <EditorContent editor={editor} />
        </StyledEditorWrapper>
      </div>
    </s.LabeledInputFields>
  );
};
