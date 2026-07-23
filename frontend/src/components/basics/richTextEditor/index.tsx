import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import api from '../../../services/api';
import './index.css';

interface Props {
    content: string;
    onChange: (html: string) => void;
}

const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('arquivo', file);
    const response = await api.post('/v1/ts/imagens', formData);
    return `http://localhost:8080/v1/ts/imagens/${response.data.id}`;
};

const RichTextEditor: React.FC<Props> = ({ content, onChange }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({ inline: false, allowBase64: false }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            handleDrop(view, event) {
                const files = event.dataTransfer?.files;
                if (files && files.length > 0 && files[0].type.startsWith('image/')) {
                    event.preventDefault();
                    uploadImage(files[0]).then(url => {
                        const { schema } = view.state;
                        const node = schema.nodes.image.create({ src: url });
                        const tr = view.state.tr.replaceSelectionWith(node);
                        view.dispatch(tr);
                    });
                    return true;
                }
                return false;
            },
            handlePaste(view, event) {
                const items = Array.from(event.clipboardData?.items || []);
                const imageItem = items.find(i => i.type.startsWith('image/'));
                if (imageItem) {
                    event.preventDefault();
                    const file = imageItem.getAsFile();
                    if (file) {
                        uploadImage(file).then(url => {
                            const { schema } = view.state;
                            const node = schema.nodes.image.create({ src: url });
                            const tr = view.state.tr.replaceSelectionWith(node);
                            view.dispatch(tr);
                        });
                        return true;
                    }
                }
                return false;
            },
        },
    });

    const insertImageFromFile = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            if (input.files?.length) {
                const url = await uploadImage(input.files[0]);
                editor?.chain().focus().setImage({ src: url }).run();
            }
        };
        input.click();
    };

    useEffect(() => {
        if (!editor) return;
        if (content !== editor.getHTML()) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className='rte-wrapper'>
            <div className='rte-toolbar'>
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'active' : ''}>
                    <b>N</b>
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'active' : ''}>
                    <i>I</i>
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleCode().run()}
                    className={editor.isActive('code') ? 'active' : ''}>
                    {'<>'}
                </button>
                <span className='rte-divider' />
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'active' : ''}>
                    H2
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={editor.isActive('heading', { level: 3 }) ? 'active' : ''}>
                    H3
                </button>
                <span className='rte-divider' />
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'active' : ''}>
                    • Lista
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'active' : ''}>
                    1. Lista
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'active' : ''}>
                    Código
                </button>
                <span className='rte-divider' />
                <button type="button" onClick={insertImageFromFile}>
                    🖼 Imagem
                </button>
            </div>
            <EditorContent editor={editor} className='rte-content' />
        </div>
    );
};

export default RichTextEditor;
