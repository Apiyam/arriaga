import { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Essentials,
  Paragraph,
  Bold,
  Italic,
  Underline,
  Link,
  List,
  Heading,
  Alignment,
  BlockQuote,
  Code,
  CodeBlock,
  Table,
  TableToolbar,
  Image,
  ImageToolbar,
  ImageUpload,
  Undo,
  FontColor,
  FontBackgroundColor,
} from "ckeditor5";
import esTranslations from "ckeditor5/translations/es.js";
import "ckeditor5/ckeditor5.css";
import { CKEDITOR_FONT_COLOR_CONFIG } from "@/lib/richText";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<ClassicEditor | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [key] = useState(0);

  useEffect(() => {
    if (editorRef.current && isReady) {
      const currentData = editorRef.current.getData();
      if (currentData !== (value || "")) {
        editorRef.current.setData(value || "");
      }
    }
  }, [value, isReady]);

  return (
    <div className="rich-text-editor">
      <CKEditor
        key={key}
        editor={ClassicEditor}
        config={{
          licenseKey: "GPL",
          language: "es",
          translations: [esTranslations],
          plugins: [
            Essentials,
            Paragraph,
            Bold,
            Italic,
            Underline,
            Link,
            List,
            Heading,
            Alignment,
            BlockQuote,
            Code,
            CodeBlock,
            Table,
            TableToolbar,
            Image,
            ImageToolbar,
            ImageUpload,
            Undo,
            FontColor,
            FontBackgroundColor,
          ],
          toolbar: {
            items: [
              "undo",
              "redo",
              "|",
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "|",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "link",
              "blockQuote",
              "|",
              "bulletedList",
              "numberedList",
              "|",
              "alignment",
              "|",
              "insertTable",
              "imageUpload",
              "code",
              "codeBlock",
            ],
            shouldNotGroupWhenFull: true,
          },
          fontColor: CKEDITOR_FONT_COLOR_CONFIG,
          fontBackgroundColor: CKEDITOR_FONT_COLOR_CONFIG,
          placeholder: placeholder || "Escribe aquí...",
          image: {
            toolbar: [
              "imageTextAlternative",
              "toggleImageCaption",
              "|",
              "imageStyle:inline",
              "imageStyle:block",
              "imageStyle:side",
            ],
          },
          table: {
            contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
          },
        }}
        data={value || ""}
        onReady={(editor) => {
          editorRef.current = editor;
          setIsReady(true);
          editor.editing.view.change((writer) => {
            writer.setStyle("min-height", "200px", editor.editing.view.document.getRoot()!);
          });
          if (value) {
            editor.setData(value);
          }
        }}
        onChange={(_, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
};
