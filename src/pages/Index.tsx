
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import UIRenderer from '@/components/UIRenderer';
import NoteList from '@/components/NoteList';
import { api } from '@/lib/api';
import { Note, UISchema } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [uiSchema, setUiSchema] = useState<UISchema>();

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch UI schema from the server
        const schemaResponse = await api.getHomeUISchema();
        if (schemaResponse.error) {
          throw new Error(schemaResponse.error);
        }
        
        setUiSchema(schemaResponse.data);
        
        // Fetch notes data
        const notesResponse = await api.getNotes();
        if (notesResponse.error) {
          throw new Error(notesResponse.error);
        }
        
        setNotes(notesResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load notes. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  // Handle delete note
  const handleDeleteNote = async (id: string) => {
    try {
      const response = await api.deleteNote(id);
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Update local state
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle UI actions
  const handleAction = async (action: string, payload?: any) => {
    console.log('Action:', action, 'Payload:', payload);
    
    switch (action) {
      case 'DELETE_NOTE':
        await handleDeleteNote(payload);
        break;
        
      default:
        console.log('Unhandled action:', action);
        break;
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        {uiSchema && (
          <UIRenderer
            schema={uiSchema}
            isLoading={loading}
            onAction={handleAction}
            data={{}}
          />
        )}
        
        {!loading && (
          <NoteList 
            notes={notes} 
            onDelete={handleDeleteNote} 
            onUpdateSchema={(updater) => {
              if (uiSchema) {
                setUiSchema(updater(uiSchema));
              }
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default Index;
