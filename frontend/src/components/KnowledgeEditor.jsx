import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect, useRef } from "react";

const CLOUDINARY_CLOUD_NAME = "dasgtpk2";
const CLOUDINARY_UPLOAD_PRESET = "knowledgehub_images";

const KnowledgeEditor = ({ value, onChange }) => {
  const deleteButtonRef = useRef(null);
  const hoveredImageRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit,

      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),

      Image.configure({
        inline: false,
        allowBase64: false,
        resize: {
          enabled: true,
          directions: ["top", "bottom", "left", "right"],
          minWidth: 100,
          minHeight: 100,
          alwaysPreserveAspectRatio: true,
        },
      }),
    ],

    content: value || "",

    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Keep editor content in sync when editing existing knowledge
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const uploadImage = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Image upload failed");
      }

      const data = await response.json();
      editor
        .chain()
        .focus()
        .insertContent({
          type: "image",
          attrs: {
            src: data.secure_url,
            alt: file.name,
          },
        })
        .run();

    } catch (error) {
      console.error("Image upload error:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  useEffect(() => {
    if (!editor) return;

    const editorElement = editor.view.dom;

    const showDeleteButton = (event) => {
      const image = event.target.closest("img");

      if (!image || !editorElement.contains(image)) {
        return;
      }

      hoveredImageRef.current = image;

      const button = deleteButtonRef.current;

      if (!button) return;

      const editorRect = editorElement.getBoundingClientRect();
      const imageRect = image.getBoundingClientRect();

      button.style.display = "flex";

      button.style.left =
        `${imageRect.right - editorRect.left - 36}px`;

      button.style.top =
        `${imageRect.top - editorRect.top + 10}px`;
    };

    const hideDeleteButton = (event) => {
      const button = deleteButtonRef.current;

      if (!button) return;

      const image = event.target.closest("img");

      if (!image) return;

      setTimeout(() => {
        if (
          !button.matches(":hover") &&
          !hoveredImageRef.current?.matches(":hover")
        ) {
          button.style.display = "none";
          hoveredImageRef.current = null;
        }
      }, 100);
    };

    editorElement.addEventListener(
      "mouseover",
      showDeleteButton
    );

    editorElement.addEventListener(
      "mouseout",
      hideDeleteButton
    );

    return () => {
      editorElement.removeEventListener(
        "mouseover",
        showDeleteButton
      );

      editorElement.removeEventListener(
        "mouseout",
        hideDeleteButton
      );
    };
  }, [editor]);

  const deleteHoveredImage = () => {
    const image = hoveredImageRef.current;

    if (!image) return;

    try {
      const pos = editor.view.posAtDOM(image, 0);
      const node = editor.state.doc.nodeAt(pos);

      if (node?.type.name === "image") {
        editor
          .chain()
          .focus()
          .deleteRange({
            from: pos,
            to: pos + node.nodeSize,
          })
          .run();
      }

      hoveredImageRef.current = null;

      if (deleteButtonRef.current) {
        deleteButtonRef.current.style.display = "none";
      }
    } catch (error) {
      console.error("Failed to delete image:", error);
    }
  };

  return (
    <div className="knowledge-editor">

      {/* Toolbar */}
      <div className="knowledge-editor-toolbar">

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "active" : ""}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "active" : ""}
        >
          <em>I</em>
        </button>

        <button
          type="button"
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
        >
          H2
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          className={editor.isActive("bulletList") ? "active" : ""}
        >
          • List
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          className={editor.isActive("orderedList") ? "active" : ""}
        >
          1. List
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          className={editor.isActive("blockquote") ? "active" : ""}
        >
          Quote
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleCodeBlock().run()
          }
          className={editor.isActive("codeBlock") ? "active" : ""}
        >
          Code
        </button>

        <button
  type="button"
  onClick={() => {
    const url = window.prompt("Enter URL");

    if (!url) return;

    editor
      .chain()
      .focus()
      .setLink({ href: url })
      .run();
  }}
  className={editor.isActive("link") ? "active" : ""}
>
  🔗 Link
</button>

        <label className="image-upload-button">
          🖼️ Upload Screenshot

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                uploadImage(file);
              }

              event.target.value = "";
            }}
          />
        </label>


        <button
          type="button"
          onClick={() =>
            editor.chain().focus().undo().run()
          }
        >
          ↶
        </button>

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().redo().run()
          }
        >
          ↷
        </button>
      </div>

      {/* Editor */}
      <div className="knowledge-editor-content">

        <button
          ref={deleteButtonRef}
          type="button"
          className="image-delete-button"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          onClick={deleteHoveredImage}
        >
          🗑️
        </button>

        <EditorContent editor={editor} />

      </div>

    </div>
  );
};

export default KnowledgeEditor;