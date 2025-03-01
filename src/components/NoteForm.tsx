
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Note, CreateNoteInput, UpdateNoteInput } from '@/types';

interface NoteFormProps {
  note?: Note;
  onSubmit: (data: CreateNoteInput | UpdateNoteInput) => void;
  isEdit?: boolean;
}

const NoteForm = ({ note, onSubmit, isEdit = false }: NoteFormProps) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
    }
  }, [note]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    setIsSubmitting(true);
    
    const data = isEdit 
      ? { id: note!.id, title, content } 
      : { title, content };
      
    await onSubmit(data);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    if (isEdit && note) {
      navigate(`/note/${note.id}`);
    } else {
      navigate('/');
    }
  };

  return (
    <Card className="glass-card max-w-2xl mx-auto animate-scale-up">
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a title"
            required
            className="text-lg"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            required
            className="min-h-[200px] resize-y text-base"
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isEdit ? 'Save Changes' : 'Create Note'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default NoteForm;
