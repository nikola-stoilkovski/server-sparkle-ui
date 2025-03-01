
import { toast } from "@/components/ui/use-toast";
import { ApiResponse, CreateNoteInput, Note, UISchema, UpdateNoteInput } from "@/types";

// Mock data - simulates server data
const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Notes',
    content: 'This is a simple note-taking application built with server-driven UI principles.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Server-Driven UI',
    content: 'Server-driven UI allows the backend to control the presentation layer of your application, making it more flexible and easier to update.',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Design Principles',
    content: 'This app follows the design principles of simplicity, clarity, and elegance - inspired by modern design systems.',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

// In-memory storage
let notes = [...initialNotes];

// Utility to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API methods
export const api = {
  // Notes CRUD operations
  async getNotes(): Promise<ApiResponse<Note[]>> {
    try {
      await delay(300); // Simulate network delay
      return { data: [...notes] };
    } catch (error) {
      console.error('Error fetching notes:', error);
      return { error: 'Failed to fetch notes. Please try again.' };
    }
  },

  async getNote(id: string): Promise<ApiResponse<Note>> {
    try {
      await delay(200);
      const note = notes.find(n => n.id === id);
      if (!note) {
        return { error: 'Note not found' };
      }
      return { data: { ...note } };
    } catch (error) {
      console.error(`Error fetching note ${id}:`, error);
      return { error: 'Failed to fetch note. Please try again.' };
    }
  },

  async createNote(input: CreateNoteInput): Promise<ApiResponse<Note>> {
    try {
      await delay(500);
      const now = new Date().toISOString();
      const newNote: Note = {
        id: Date.now().toString(),
        ...input,
        createdAt: now,
        updatedAt: now,
      };
      notes = [newNote, ...notes];
      toast({
        title: "Note created",
        description: "Your note has been created successfully",
      });
      return { data: newNote };
    } catch (error) {
      console.error('Error creating note:', error);
      return { error: 'Failed to create note. Please try again.' };
    }
  },

  async updateNote(input: UpdateNoteInput): Promise<ApiResponse<Note>> {
    try {
      await delay(500);
      const index = notes.findIndex(n => n.id === input.id);
      if (index === -1) {
        return { error: 'Note not found' };
      }
      
      const updatedNote = {
        ...notes[index],
        ...input,
        updatedAt: new Date().toISOString(),
      };
      
      notes = [
        ...notes.slice(0, index),
        updatedNote,
        ...notes.slice(index + 1),
      ];
      
      toast({
        title: "Note updated",
        description: "Your note has been updated successfully",
      });
      
      return { data: updatedNote };
    } catch (error) {
      console.error(`Error updating note ${input.id}:`, error);
      return { error: 'Failed to update note. Please try again.' };
    }
  },

  async deleteNote(id: string): Promise<ApiResponse<boolean>> {
    try {
      await delay(400);
      const index = notes.findIndex(n => n.id === id);
      if (index === -1) {
        return { error: 'Note not found' };
      }
      
      notes = [...notes.slice(0, index), ...notes.slice(index + 1)];
      
      toast({
        title: "Note deleted",
        description: "Your note has been deleted successfully",
      });
      
      return { data: true };
    } catch (error) {
      console.error(`Error deleting note ${id}:`, error);
      return { error: 'Failed to delete note. Please try again.' };
    }
  },

  // Server-driven UI schema endpoints
  async getHomeUISchema(): Promise<ApiResponse<UISchema>> {
    await delay(200);
    return {
      data: {
        components: [
          {
            id: 'header',
            type: 'container',
            className: 'flex flex-col space-y-2 mb-8',
            children: [
              {
                id: 'home-title',
                type: 'text',
                content: 'Notes',
                variant: 'h1',
                className: 'text-4xl font-bold tracking-tight'
              },
              {
                id: 'home-subtitle',
                type: 'text',
                content: 'A simple note-taking app with server-driven UI',
                variant: 'p',
                className: 'text-muted-foreground'
              }
            ]
          },
          {
            id: 'actions',
            type: 'container',
            className: 'flex justify-between items-center mb-8',
            children: [
              {
                id: 'filter-label',
                type: 'text',
                content: 'Your Notes',
                variant: 'h3',
                className: 'text-xl font-medium'
              },
              {
                id: 'create-button',
                type: 'button',
                content: 'New Note',
                variant: 'primary',
                className: 'px-4 py-2',
                events: {
                  click: {
                    action: 'NAVIGATE',
                    payload: '/create'
                  }
                }
              }
            ]
          },
          {
            id: 'notes-list-container',
            type: 'container',
            className: 'space-y-4',
            children: [
              {
                id: 'notes-list',
                type: 'list',
                className: 'space-y-4',
                items: [] // This will be populated dynamically
              }
            ]
          }
        ]
      }
    };
  },

  async getNoteUISchema(id: string): Promise<ApiResponse<UISchema>> {
    await delay(200);
    return {
      data: {
        components: [
          {
            id: 'view-note-container',
            type: 'container',
            className: 'max-w-2xl mx-auto',
            children: [
              {
                id: 'header',
                type: 'container',
                className: 'mb-8 flex items-center justify-between',
                children: [
                  {
                    id: 'back-button',
                    type: 'button',
                    content: 'Back',
                    variant: 'ghost',
                    className: 'flex items-center gap-2',
                    events: {
                      click: {
                        action: 'NAVIGATE',
                        payload: '/'
                      }
                    }
                  },
                  {
                    id: 'actions',
                    type: 'container',
                    className: 'flex gap-2',
                    children: [
                      {
                        id: 'edit-button',
                        type: 'button',
                        content: 'Edit',
                        variant: 'outline',
                        events: {
                          click: {
                            action: 'NAVIGATE',
                            payload: `/edit/${id}`
                          }
                        }
                      },
                      {
                        id: 'delete-button',
                        type: 'button',
                        content: 'Delete',
                        variant: 'destructive',
                        events: {
                          click: {
                            action: 'DELETE_NOTE',
                            payload: id
                          }
                        }
                      }
                    ]
                  }
                ]
              },
              {
                id: 'note-title',
                type: 'text',
                content: '',  // Will be filled dynamically
                variant: 'h1',
                className: 'text-3xl font-bold tracking-tight mb-4'
              },
              {
                id: 'note-meta',
                type: 'text',
                content: '',  // Will be filled dynamically
                variant: 'p',
                className: 'text-sm text-muted-foreground mb-8'
              },
              {
                id: 'note-content',
                type: 'text',
                content: '',  // Will be filled dynamically
                variant: 'p',
                className: 'leading-7 whitespace-pre-line'
              }
            ]
          }
        ]
      }
    };
  },

  async getCreateNoteUISchema(): Promise<ApiResponse<UISchema>> {
    await delay(200);
    return {
      data: {
        components: [
          {
            id: 'create-note-container',
            type: 'container',
            className: 'max-w-2xl mx-auto',
            children: [
              {
                id: 'header',
                type: 'container',
                className: 'mb-8',
                children: [
                  {
                    id: 'back-button',
                    type: 'button',
                    content: 'Back',
                    variant: 'ghost',
                    className: 'mb-4',
                    events: {
                      click: {
                        action: 'NAVIGATE',
                        payload: '/'
                      }
                    }
                  },
                  {
                    id: 'create-title',
                    type: 'text',
                    content: 'Create New Note',
                    variant: 'h1',
                    className: 'text-3xl font-bold tracking-tight'
                  }
                ]
              },
              {
                id: 'create-form',
                type: 'form',
                className: 'space-y-8',
                submitLabel: 'Create Note',
                cancelLabel: 'Cancel',
                events: {
                  submit: {
                    action: 'CREATE_NOTE'
                  },
                  cancel: {
                    action: 'NAVIGATE',
                    payload: '/'
                  }
                },
                children: [
                  {
                    id: 'title-input',
                    type: 'input',
                    name: 'title',
                    label: 'Title',
                    placeholder: 'Enter note title',
                    validation: {
                      required: true,
                      maxLength: 100
                    },
                    className: 'w-full'
                  },
                  {
                    id: 'content-input',
                    type: 'input',
                    name: 'content',
                    label: 'Content',
                    placeholder: 'Enter note content',
                    inputType: 'textarea',
                    validation: {
                      required: true
                    },
                    className: 'w-full h-64'
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  },

  async getEditNoteUISchema(id: string): Promise<ApiResponse<UISchema>> {
    await delay(200);
    return {
      data: {
        components: [
          {
            id: 'edit-note-container',
            type: 'container',
            className: 'max-w-2xl mx-auto',
            children: [
              {
                id: 'header',
                type: 'container',
                className: 'mb-8',
                children: [
                  {
                    id: 'back-button',
                    type: 'button',
                    content: 'Back',
                    variant: 'ghost',
                    className: 'mb-4',
                    events: {
                      click: {
                        action: 'NAVIGATE',
                        payload: `/note/${id}`
                      }
                    }
                  },
                  {
                    id: 'edit-title',
                    type: 'text',
                    content: 'Edit Note',
                    variant: 'h1',
                    className: 'text-3xl font-bold tracking-tight'
                  }
                ]
              },
              {
                id: 'edit-form',
                type: 'form',
                className: 'space-y-8',
                submitLabel: 'Save Changes',
                cancelLabel: 'Cancel',
                events: {
                  submit: {
                    action: 'UPDATE_NOTE',
                    payload: { id }
                  },
                  cancel: {
                    action: 'NAVIGATE',
                    payload: `/note/${id}`
                  }
                },
                children: [
                  {
                    id: 'title-input',
                    type: 'input',
                    name: 'title',
                    label: 'Title',
                    placeholder: 'Enter note title',
                    defaultValue: '',  // Will be filled dynamically
                    validation: {
                      required: true,
                      maxLength: 100
                    },
                    className: 'w-full'
                  },
                  {
                    id: 'content-input',
                    type: 'input',
                    name: 'content',
                    label: 'Content',
                    placeholder: 'Enter note content',
                    defaultValue: '',  // Will be filled dynamically
                    inputType: 'textarea',
                    validation: {
                      required: true
                    },
                    className: 'w-full h-64'
                  }
                ]
              }
            ]
          }
        ]
      }
    };
  }
};
