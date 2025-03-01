
// Base types for server-driven UI
export type UIComponentType = 
  | 'text'
  | 'button'
  | 'input'
  | 'card'
  | 'list'
  | 'container'
  | 'form'
  | 'image';

export interface UIBaseComponent {
  id: string;
  type: UIComponentType;
  visible?: boolean;
  className?: string;
  events?: {
    [key: string]: {
      action: string;
      payload?: any;
    };
  };
}

export interface UITextComponent extends UIBaseComponent {
  type: 'text';
  content: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
}

export interface UIButtonComponent extends UIBaseComponent {
  type: 'button';
  content: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
}

export interface UIInputComponent extends UIBaseComponent {
  type: 'input';
  name: string;
  label?: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: 'text' | 'textarea' | 'number' | 'email' | 'password';
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface UICardComponent extends UIBaseComponent {
  type: 'card';
  children: UIComponent[];
}

export interface UIListComponent extends UIBaseComponent {
  type: 'list';
  items: UIComponent[];
  layout?: 'vertical' | 'horizontal' | 'grid';
}

export interface UIContainerComponent extends UIBaseComponent {
  type: 'container';
  children: UIComponent[];
}

export interface UIFormComponent extends UIBaseComponent {
  type: 'form';
  children: UIComponent[];
  submitLabel?: string;
  cancelLabel?: string;
}

export interface UIImageComponent extends UIBaseComponent {
  type: 'image';
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export type UIComponent = 
  | UITextComponent
  | UIButtonComponent
  | UIInputComponent
  | UICardComponent
  | UIListComponent
  | UIContainerComponent
  | UIFormComponent
  | UIImageComponent;

export interface UISchema {
  components: UIComponent[];
}

// Note types
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNoteInput {
  title: string;
  content: string;
}

export interface UpdateNoteInput extends Partial<CreateNoteInput> {
  id: string;
}

// API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
