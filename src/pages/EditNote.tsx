
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import Layout from '@/components/Layout';
import UIRenderer from '@/components/UIRenderer';
import { api } from '@/lib/api';
import { Note, UISchema, UpdateNoteInput } from '@/types';
import { updateComponentById } from '@/lib/utils';

const EditNote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [uiSchema, setUiSchema] = useState<UISchema>();
  const [api, contextHolder] = notification.useNotification();

  // Fetch note and UI schema
  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        navigate('/');
        return;
      }

      setLoading(true);
      try {
        // Fetch note data first
        const noteResponse = await api.getNote(id);
        if (noteResponse.error || !noteResponse.data) {
          throw new Error(noteResponse.error || 'Note not found');
        }
        
        setNote(noteResponse.data);
        
        // Then fetch UI schema
        const schemaResponse = await api.getEditNoteUISchema(id);
        if (schemaResponse.error) {
          throw new Error(schemaResponse.error);
        }
        
        // Update form inputs with note data
        if (schemaResponse.data && noteResponse.data) {
          let updatedSchema = schemaResponse.data;
          
          // Update title input
          updatedSchema = updateComponentById(
            updatedSchema, 
            'title-input', 
            { defaultValue: noteResponse.data.title }
          );
          
          // Update content input
          updatedSchema = updateComponentById(
            updatedSchema, 
            'content-input', 
            { defaultValue: noteResponse.data.content }
          );
          
          setUiSchema(updatedSchema);
        }
      } catch (error) {
        console.error('Error fetching note:', error);
        api.error({
          message: 'Error',
          description: 'Failed to load note. Please try again.',
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Handle UI actions
  const handleAction = async (action: string, payload?: any) => {
    console.log('Action:', action, 'Payload:', payload);
    
    switch (action) {
      case 'UPDATE_NOTE':
        if (!id || !payload?.formData) return;
        
        try {
          const { title, content } = payload.formData;
          
          if (!title || !content) {
            api.error({
              message: 'Validation Error',
              description: 'Title and content are required.',
            });
            return;
          }
          
          const noteData: UpdateNoteInput = { 
            id,
            title, 
            content 
          };
          
          const response = await api.updateNote(noteData);
          
          if (response.error) {
            throw new Error(response.error);
          }
          
          navigate(`/note/${id}`);
        } catch (error) {
          console.error('Error updating note:', error);
          api.error({
            message: 'Error',
            description: 'Failed to update note. Please try again.',
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
      {contextHolder}
      <div style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
        <UIRenderer
          schema={uiSchema}
          isLoading={loading}
          onAction={handleAction}
          data={{
            'title-input': { defaultValue: note?.title },
            'content-input': { defaultValue: note?.content }
          }}
        />
      </div>
    </Layout>
  );
};

export default EditNote;
