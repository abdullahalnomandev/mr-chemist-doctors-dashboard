"use client";

import { cn } from "@/lib/utils";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Table as TableIcon,
  Trash,
  Undo,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Separator } from "./separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const MenuButton = ({
  onClick,
  isActive = false,
  disabled = false,
  children,
  title,
}: {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}) => (
  <Button
    type="button"
    variant={isActive ? "default" : "ghost"}
    size="icon"
    onClick={onClick}
    disabled={disabled}
    className="h-8 w-8"
    title={title}
  >
    {children}
  </Button>
);

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something...",
  minHeight = "300px",
}: RichTextEditorProps) {
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [tableSize, setTableSize] = useState({ rows: 3, cols: 3 });
  const [hoveredCell, setHoveredCell] = useState({ row: 0, col: 0 });
  const tableSelectorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableSelectorRef.current &&
        !tableSelectorRef.current.contains(event.target as Node)
      ) {
        setShowTableSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!editor) {
    return null;
  }

  const addTable = (rows: number, cols: number) => {
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: false })
      .run();
    setShowTableSelector(false);
  };

  const deleteTable = () => {
    editor.chain().focus().deleteTable().run();
  };

  return (
    <div className="border rounded-md overflow-hidden flex flex-col">
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none flex-grow overflow-auto"
        style={{
          minHeight: minHeight,
          resize: "vertical",
        }}
      />

      <div className="bg-muted p-1 flex flex-wrap gap-1 border-t">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </MenuButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </MenuButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </MenuButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code className="h-4 w-4" />
        </MenuButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <div className="relative" ref={tableSelectorRef}>
          <MenuButton
            onClick={() => setShowTableSelector(!showTableSelector)}
            isActive={editor.isActive("table") || showTableSelector}
            title="Insert Table"
          >
            <TableIcon className="h-4 w-4" />
          </MenuButton>

          {showTableSelector && (
            <div className="absolute z-50 bg-white border rounded-md shadow-md p-2 bottom-full left-0 mb-1">
              <div className="text-xs text-center mb-1 font-medium">
                {hoveredCell.row + 1} × {hoveredCell.col + 1} Table
              </div>

              {/* Rest of the table selector content */}
              <div className="grid grid-cols-6 gap-1 w-[150px]">
                {Array.from({ length: 6 }).map((_, rowIndex) =>
                  Array.from({ length: 6 }).map((_, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={cn(
                        "w-5 h-5 border cursor-pointer transition-colors",
                        rowIndex <= hoveredCell.row &&
                          colIndex <= hoveredCell.col
                          ? "bg-primary border-primary"
                          : "bg-muted-foreground/20"
                      )}
                      onMouseEnter={() =>
                        setHoveredCell({ row: rowIndex, col: colIndex })
                      }
                      onClick={() => addTable(rowIndex + 1, colIndex + 1)}
                    />
                  ))
                )}
              </div>
              <div className="mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs">Rows:</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tableSize.rows}
                    onChange={(e) =>
                      setTableSize({
                        ...tableSize,
                        rows: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-12 h-6 text-xs border rounded px-1"
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs">Columns:</span>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tableSize.cols}
                    onChange={(e) =>
                      setTableSize({
                        ...tableSize,
                        cols: Math.max(1, parseInt(e.target.value) || 1),
                      })
                    }
                    className="w-12 h-6 text-xs border rounded px-1"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="w-full mt-1 text-xs h-7"
                  onClick={() => addTable(tableSize.rows, tableSize.cols)}
                >
                  Insert
                </Button>
              </div>
            </div>
          )}
        </div>

        {editor.isActive("table") && (
          <MenuButton onClick={deleteTable} title="Delete Table">
            <Trash className="h-4 w-4" />
          </MenuButton>
        )}

        <Separator orientation="vertical" className="mx-1 h-6" />

        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </MenuButton>
      </div>
    </div>
  );
}
