
import { useNavigate } from 'react-router-dom';
import { Note } from '@/types';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate, truncateText, getStaggeredAnimationClass } from '@/lib/utils';

interface NoteItemProps {
  note: Note;
  index: number;
  onDelete: (id: string) => void;
}

const NoteItem = ({ note, index, onDelete }: NoteItemProps) => {
  const navigate = useNavigate();
  
  const handleView = () => {
    navigate(`/note/${note.id}`);
  };
  
  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit/${note.id}`);
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(note.id);
  };

  return (
    <Card 
      className={`glass-card cursor-pointer group ${getStaggeredAnimationClass(index, 'slide-up')}`}
      onClick={handleView}
    >
      <CardContent className="p-6">
        <h3 className="text-xl font-medium mb-2">{note.title}</h3>
        <p className="text-muted-foreground mb-4">
          {truncateText(note.content, 150)}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatDate(note.updatedAt)}
        </p>
      </CardContent>
      
      <CardFooter className="px-6 py-4 bg-secondary/50 flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button variant="outline" size="sm" onClick={handleEdit}>
          Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NoteItem;
