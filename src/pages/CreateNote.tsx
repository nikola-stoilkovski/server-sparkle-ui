
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import UIRenderer from '@/components/UIRenderer';
import { api } from '@/lib/api';
import { CreateNoteInput, UISchema } from '@/types';
import { useToast } from '@/components/ui/use-toast';

const CreateNote = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uiSchema, setUiSchema] = useState<UISchema>();

  // Fetch UI schema
  useEffect(() => {
    const fetchSchema = async () => {
      setLoading(true);
      try {
        const response = await api.getCreateNoteUISchema();
        if (response.error) {
          throw new Error(response.error);
        }
        
        setUiSchema(response.data);
      } catch (error) {
        console.error('Error fetching UI schema:', error);
        toast({
          title: "Error",
          description: "Failed to load form. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, [toast]);

  // Handle UI actions
  const handleAction = async (action: string, payload?: any) => {
    console.log('Action:', action, 'Payload:', payload);
    
    switch (action) {
      case 'CREATE_NOTE':
        if (!payload?.formData) return;
        
        try {
          const { title, content } = payload.formData;
          
          if (!title || !content) {
            toast({
              title: "Validation Error",
              description: "Title and content are required.",
              variant: "destructive",
            });
            return;
          }
          
          const noteData: CreateNoteInput = { title, content };
          const response = await api.createNote(noteData);
          
          if (response.error) {
            throw new Error(response.error);
          }
          
          navigate('/');
        } catch (error) {
          console.error('Error creating note:', error);
          toast({
            title: "Error",
            description: "Failed to create note. Please try again.",
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

export default CreateNote;
