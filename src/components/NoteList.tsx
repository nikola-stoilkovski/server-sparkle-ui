
import { useState, useEffect } from 'react';
import { Typography, Empty, Row, Col } from 'antd';
import NoteItem from './NoteItem';
import { api } from '@/lib/api';
import { Note } from '@/types';
import { updateComponentById } from '@/lib/utils';

const { Title, Paragraph } = Typography;

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
        style: { cursor: 'pointer' },
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
          },
          {
            id: `note-content-${note.id}`,
            type: 'text' as const,
            content: note.content.length > 150 
              ? `${note.content.substring(0, 150)}...` 
              : note.content,
            variant: 'p' as const,
          },
          {
            id: `note-date-${note.id}`,
            type: 'text' as const,
            content: new Date(note.updatedAt).toLocaleDateString(),
            variant: 'span' as const,
            style: { fontSize: '12px', color: 'rgba(0, 0, 0, 0.45)' }
          }
        ]
      }));

      // Find the notes-list component and update its items
      return updateComponentById(schema, 'notes-list', { items: noteItems });
    });
  }, [notes, onUpdateSchema]);

  if (notes.length === 0) {
    return (
      <Empty
        description="No notes yet"
        style={{ margin: '48px 0' }}
      >
        <Paragraph type="secondary">Create your first note to get started</Paragraph>
      </Empty>
    );
  }

  return (
    <Row gutter={[16, 16]}>
      {notes.map((note, index) => (
        <Col xs={24} sm={12} lg={8} key={note.id}>
          <NoteItem 
            note={note} 
            index={index} 
            onDelete={onDelete} 
          />
        </Col>
      ))}
    </Row>
  );
};

export default NoteList;
