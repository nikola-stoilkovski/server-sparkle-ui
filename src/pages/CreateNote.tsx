
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import Layout from '@/components/Layout';
import UIRenderer from '@/components/UIRenderer';
import { api } from '@/lib/api';
import { CreateNoteInput, UISchema } from '@/types';

const CreateNote = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [uiSchema, setUiSchema] = useState<UISchema>();
  const [api, contextHolder] = notification.useNotification();

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
        api.error({
          message: 'Error',
          description: 'Failed to load form. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchema();
  }, []);

  // Handle UI actions
  const handleAction = async (action: string, payload?: any) => {
    console.log('Action:', action, 'Payload:', payload);
    
    switch (action) {
      case 'CREATE_NOTE':
        if (!payload?.formData) return;
        
        try {
          const { title, content } = payload.formData;
          
          if (!title || !content) {
            api.error({
              message: 'Validation Error',
              description: 'Title and content are required.',
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
          api.error({
            message: 'Error',
            description: 'Failed to create note. Please try again.',
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
          data={{}}
        />
      </div>
    </Layout>
  );
};

export default CreateNote;
