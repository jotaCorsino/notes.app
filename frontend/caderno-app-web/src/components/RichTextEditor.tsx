import { useEffect, useRef, useState } from 'react'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Underline,
  Highlight.configure({
    multicolor: false,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
]

interface RichTextEditorProps {
  initialContent: string
  labelledBy: string
  pageNumber: number
  onContentChange?: (content: string) => void
  onEditorReady?: (editor: Editor | null) => void
}

export function RichTextEditor({
  initialContent,
  labelledBy,
  pageNumber,
  onContentChange,
  onEditorReady,
}: RichTextEditorProps) {
  const [localContent, setLocalContent] = useState(initialContent)
  const onContentChangeRef = useRef(onContentChange)

  useEffect(() => {
    onContentChangeRef.current = onContentChange
  }, [onContentChange])

  const editor = useEditor({
    extensions: editorExtensions,
    content: initialContent,
    editorProps: {
      attributes: {
        'aria-labelledby': labelledBy,
        'aria-label': `Editor local da página ${pageNumber}`,
        class: 'rich-text-editor__content',
        spellcheck: 'false',
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      const nextContent = updatedEditor.getHTML()
      setLocalContent(nextContent)
      onContentChangeRef.current?.(nextContent)
    },
  })

  useEffect(() => {
    onEditorReady?.(editor)

    return () => {
      onEditorReady?.(null)
    }
  }, [editor, onEditorReady])

  useEffect(() => {
    if (!editor || editor.getHTML() === initialContent) {
      return
    }

    editor.commands.setContent(initialContent, { emitUpdate: false })
    setLocalContent(initialContent)
  }, [editor, initialContent])

  return (
    <div className="rich-text-editor" data-local-content-length={localContent.length}>
      <EditorContent editor={editor} />
    </div>
  )
}
