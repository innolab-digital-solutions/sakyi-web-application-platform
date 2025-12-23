"use client";

import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  ListOrdered,
  ListTodo,
  Minus,
  Quote,
  Redo2,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";
import React, { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/utils/shared/cn";

export interface RichTextEditorFieldProperties {
  id: string;
  label?: React.ReactNode;
  error?: string;
  description?: string;
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  editorClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
}

export default function EditorField({
  id,
  label,
  error,
  description,
  value,
  onChange,
  required = false,
  disabled = false,
  containerClassName,
  labelClassName,
  editorClassName,
  errorClassName,
  descriptionClassName,
}: RichTextEditorFieldProperties) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content: value ?? "",
    editorProps: {
      attributes: {
        id,
        class: "focus:outline-none text-sm leading-relaxed",
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editable: !disabled,
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== undefined && value !== current) {
      editor.commands.setContent(value, false);
    }
  }, [editor, value]);

  const hasError = Boolean(error);

  const blockTypeValue =
    editor && editor.isActive("heading", { level: 1 })
      ? "heading1"
      : editor && editor.isActive("heading", { level: 2 })
        ? "heading2"
        : editor && editor.isActive("heading", { level: 3 })
          ? "heading3"
          : "paragraph";

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn(
            "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            labelClassName,
          )}
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}

      <div
        className={cn(
          "border-input bg-background ring-offset-background focus-within:ring-ring flex min-h-[220px] flex-col overflow-hidden rounded-md border text-sm shadow-sm transition-all transition-colors duration-300 focus-within:ring-2 focus-within:ring-offset-2 focus-within:outline-none",
          hasError && "border-red-500 focus-within:ring-red-500",
          disabled && "pointer-events-none opacity-60",
          editorClassName,
        )}
      >
        {/* Toolbar */}
        <div className="border-b border-gray-200 bg-gray-50 px-3 py-3">
          <TooltipProvider delayDuration={150}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <Select
                  value={blockTypeValue}
                  onValueChange={(value) => {
                    if (!editor) return;
                    const chain = editor.chain().focus();
                    switch (value) {
                      case "heading1": {
                        chain.toggleHeading({ level: 1 }).run();
                        break;
                      }
                      case "heading2": {
                        chain.toggleHeading({ level: 2 }).run();
                        break;
                      }
                      case "heading3": {
                        chain.toggleHeading({ level: 3 }).run();
                        break;
                      }
                      default: {
                        chain.setParagraph().run();
                        break;
                      }
                    }
                  }}
                  disabled={!editor}
                >
                  <SelectTrigger className="h-8 w-[140px] rounded-sm border bg-white px-2 text-xs font-medium text-gray-800 shadow-none focus:ring-0 focus:ring-offset-0">
                    <SelectValue placeholder="Paragraph" />
                  </SelectTrigger>
                  <SelectContent className="rounded-sm">
                    <SelectItem value="paragraph" className="text-xs!">
                      Paragraph
                    </SelectItem>
                    <SelectItem value="heading1" className="text-xs!">
                      Heading 1
                    </SelectItem>
                    <SelectItem value="heading2" className="text-xs!">
                      Heading 2
                    </SelectItem>
                    <SelectItem value="heading3" className="text-xs!">
                      Heading 3
                    </SelectItem>
                  </SelectContent>
                </Select>

                <span className="mx-1 h-5 w-px bg-gray-200" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive("bold") && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => editor?.chain().focus().toggleBold().run()}
                      disabled={!editor || !editor.can().toggleBold()}
                      aria-label="Bold"
                    >
                      <Bold className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Bold
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        "data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900",
                      )}
                      onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                      disabled={!editor}
                      aria-label="Horizontal rule"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Horizontal rule
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive("italic") && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => editor?.chain().focus().toggleItalic().run()}
                      disabled={!editor || !editor.can().toggleItalic()}
                      aria-label="Italic"
                    >
                      <Italic className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Italic
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive("underline") && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => {
                        if (!editor) return;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (editor.chain().focus() as any).toggleUnderline().run();
                      }}
                      disabled={!editor}
                      aria-label="Underline"
                    >
                      <UnderlineIcon className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Underline
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive("strike") && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => editor?.chain().focus().toggleStrike().run()}
                      disabled={!editor}
                      aria-label="Strikethrough"
                    >
                      <Strikethrough className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Strikethrough
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive("bulletList") && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => editor?.chain().focus().toggleBulletList().run()}
                      disabled={!editor}
                      aria-label="Bulleted list"
                    >
                      <ListTodo className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Bulleted list
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive("orderedList") && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                      disabled={!editor}
                      aria-label="Numbered list"
                    >
                      <ListOrdered className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Numbered list
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive("blockquote") && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                      disabled={!editor}
                      aria-label="Quote"
                    >
                      <Quote className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Quote
                  </TooltipContent>
                </Tooltip>

                <span className="mx-1 h-5 w-px bg-gray-200" />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive("link") && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => {
                        if (!editor) return;
                        const previousUrl = editor.getAttributes("link").href as string | undefined;

                        const url = globalThis.prompt("Enter URL", previousUrl ?? "https://");
                        if (url === null) return;
                        if (url === "") {
                          editor.chain().focus().unsetLink().run();
                          return;
                        }
                        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
                      }}
                      disabled={!editor}
                      aria-label="Insert link"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Insert link
                  </TooltipContent>
                </Tooltip>

                {/* Indent / outdent for lists */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => editor?.chain().focus().sinkListItem("listItem").run()}
                      disabled={!editor}
                      aria-label="Increase indent"
                    >
                      <IndentIncrease className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Increase indent
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      onClick={() => editor?.chain().focus().liftListItem("listItem").run()}
                      disabled={!editor}
                      aria-label="Decrease indent"
                    >
                      <IndentDecrease className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Decrease indent
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive({ textAlign: "left" }) && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => {
                        if (!editor) return;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (editor.chain().focus() as any).setTextAlign("left").run();
                      }}
                      disabled={!editor}
                      aria-label="Align left"
                    >
                      <AlignLeft className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Align left
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive({ textAlign: "center" }) && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => {
                        if (!editor) return;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (editor.chain().focus() as any).setTextAlign("center").run();
                      }}
                      disabled={!editor}
                      aria-label="Align center"
                    >
                      <AlignCenter className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Align center
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className={cn(
                        "h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                        editor?.isActive({ textAlign: "right" }) && "bg-gray-200 text-gray-900",
                      )}
                      onClick={() => {
                        if (!editor) return;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        (editor.chain().focus() as any).setTextAlign("right").run();
                      }}
                      disabled={!editor}
                      aria-label="Align right"
                    >
                      <AlignRight className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Align right
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-1.5">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40"
                      onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}
                      disabled={!editor}
                    >
                      <Eraser className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Clear formatting
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40"
                      onClick={() => editor?.chain().focus().undo().run()}
                      disabled={!editor || !editor.can().undo()}
                      aria-label="Undo"
                    >
                      <Undo2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Undo
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 cursor-pointer rounded-sm p-0 text-xs text-gray-700 hover:bg-gray-100 hover:text-gray-900 disabled:opacity-40"
                      onClick={() => editor?.chain().focus().redo().run()}
                      disabled={!editor || !editor.can().redo()}
                      aria-label="Redo"
                    >
                      <Redo2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="bg-popover text-popover-foreground border-border w-fit rounded-md border px-3 py-2 shadow-lg"
                  >
                    Redo
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </TooltipProvider>
        </div>

        {/* Editor Content */}
        <div
          className={cn(
            "bg-background text-foreground min-h-[180px] px-3 py-2 text-sm " +
              "[&_h1]:mb-1 [&_h1]:text-2xl [&_h1]:font-semibold " +
              "[&_h2]:mb-1 [&_h2]:text-xl [&_h2]:font-semibold " +
              "[&_h3]:mb-1 [&_h3]:text-lg [&_h3]:font-semibold " +
              "[&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5 " +
              "[&_blockquote]:border-l-2 [&_blockquote]:border-gray-300 [&_blockquote]:pl-3 [&_blockquote]:italic " +
              "[&_a]:text-primary [&_a:hover]:text-primary/80 [&_a]:underline [&_a]:underline-offset-2",
            hasError && "border-red-500",
          )}
        >
          <EditorContent editor={editor} />
        </div>
      </div>

      {description && (
        <p
          className={cn("text-muted-foreground text-sm", descriptionClassName)}
          id={`${id}-description`}
        >
          {description}
        </p>
      )}

      {error && (
        <p
          className={cn(
            "animate-in slide-in-from-top-1 text-sm font-medium text-red-600",
            errorClassName,
          )}
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
