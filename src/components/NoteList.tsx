
import { useState, useEffect } from 'react';
import NoteItem from './NoteItem';
import { api } from '@/lib/api';
import { Note } from '@/types';
import { updateComponentById } from '@/lib/utils';

interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => void;
  onUpdateSchema: (schemaUpdater: (schema: any) => any) => void;
}

const NoteList = ({ notes, onDelete, onUpdateSchema }: NoteListProps) => {
  useEffect(() => {
    // Update the UI schema with note items
    onUpdateSchema((schema) => {
      const noteItems = notes.map((note) => ({
        id: `note-item-${note.id}`,
        type: 'card' as const,
        className: 'glass-card cursor-pointer group animate-scale-up',
        events: {
          click: {
            action: 'NAVIGATE',
            payload: `/note/${note.id}`
          }
        },
        children: [
          {
            id: `note-title-${note.id}`,
            type: 'text' as const,
            content: note.title,
            variant: 'h3' as const,
            className: 'text-xl font-medium mb-2'
          },
          {
            id: `note-content-${note.id}`,
            type: 'text' as const,
            content: note.content.length > 150 
              ? `${note.content.substring(0, 150)}...` 
              : note.content,
            variant: 'p' as const,
            className: 'text-muted-foreground mb-4'
          },
          {
            id: `note-date-${note.id}`,
            type: 'text' as const,
            content: new Date(note.updatedAt).toLocaleDateString(),
            variant: 'p' as const,
            className: 'text-xs text-muted-foreground'
          }
        ]
      }));

      // Find the notes-list component and update its items
      return updateComponentById(schema, 'notes-list', { items: noteItems });
    });
  }, [notes, onUpdateSchema]);

  if (notes.length === 0) {
    return (
      <div className="text-center py-12 animate-fade-in">
        <h3 className="text-xl font-medium text-muted-foreground">No notes yet</h3>
        <p className="text-muted-foreground mt-2">Create your first note to get started</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((note, index) => (
        <NoteItem 
          key={note.id} 
          note={note} 
          index={index} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default NoteList;
