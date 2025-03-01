
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import UIRenderer from '@/components/UIRenderer';
import { api } from '@/lib/api';
import { Note, UISchema } from '@/types';
import { formatDate, findComponentById, updateComponentById } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const ViewNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [uiSchema, setUiSchema] = useState<UISchema>();

  // Fetch note and UI schema
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        // Fetch UI schema
        const schemaResponse = await api.getNoteUISchema(id);
        if (schemaResponse.error) {
          throw new Error(schemaResponse.error);
        }
        
        setUiSchema(schemaResponse.data);
        
        // Fetch note data
        const noteResponse = await api.getNote(id);
        if (noteResponse.error) {
          throw new Error(noteResponse.error);
        }
        
        if (!noteResponse.data) {
          navigate('/');
          return;
        }
        
        setNote(noteResponse.data);
        
        // Update UI schema with note data
        if (schemaResponse.data && noteResponse.data) {
          const updatedSchema = schemaResponse.data;
          
          // Update title component
          const updatedSchema1 = updateComponentById(
            updatedSchema, 
            'note-title', 
            { content: noteResponse.data.title }
          );
          
          // Update content component
          const updatedSchema2 = updateComponentById(
            updatedSchema1, 
            'note-content', 
            { content: noteResponse.data.content }
          );
          
          // Update meta component
          const formattedDate = formatDate(noteResponse.data.updatedAt);
          const metaText = `Last updated ${formattedDate}`;
          
          const updatedSchema3 = updateComponentById(
            updatedSchema2, 
            'note-meta', 
            { content: metaText }
          );
          
          setUiSchema(updatedSchema3);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        toast({
          title: "Error",
          description: "Failed to load note. Please try again.",
          variant: "destructive",
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, toast]);

  // Handle UI actions
  const handleAction = async (action: string, payload?: any) => {
    console.log('Action:', action, 'Payload:', payload);
    
    switch (action) {
      case 'DELETE_NOTE':
        if (!id) return;
        
        try {
          const response = await api.deleteNote(id);
          if (response.error) {
            throw new Error(response.error);
          }
          
          navigate('/');
        } catch (error) {
          console.error('Error deleting note:', error);
          toast({
            title: "Error",
            description: "Failed to delete note. Please try again.",
            variant: "destructive",
          });
        }
        break;
        
      default:
        console.log('Unhandled action:', action);
        break;
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <UIRenderer
          schema={uiSchema}
          isLoading={loading}
          onAction={handleAction}
          data={{}}
        />
      </div>
    </Layout>
  );
};

export default ViewNote;
