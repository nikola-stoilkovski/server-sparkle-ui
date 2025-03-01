
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UIComponent, UISchema } from '@/types';
import { 
  Typography, Button, Input, Form, Card, Skeleton, Space, 
  Divider, Image as AntImage, notification
} from 'antd';
import { cn } from '@/lib/utils';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

interface UIRendererProps {
  schema?: UISchema;
  isLoading?: boolean;
  onAction: (action: string, payload?: any) => void;
  data?: Record<string, any>;
}

export const UIRenderer = ({ schema, isLoading, onAction, data = {} }: UIRendererProps) => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [form] = Form.useForm();
  
  // Update form state with data
  useEffect(() => {
    if (data && Object.keys(data).length) {
      setFormState(data);
      form.setFieldsValue(data);
    }
  }, [data, form]);

  // Handle actions from UI events
  const handleAction = (action: string, payload?: any) => {
    switch (action) {
      case 'NAVIGATE':
        navigate(payload);
        break;
      default:
        // Pass other actions to parent component
        onAction(action, payload);
        break;
    }
  };

  // Handle form input changes
  const handleInputChange = (name: string, value: any) => {
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleFormSubmit = (action: string, payload?: any) => {
    onAction(action, { ...payload, formData: formState });
  };

  // Render loading skeleton
  if (isLoading || !schema) {
    return (
      <div style={{ padding: 16 }}>
        <Skeleton active title paragraph={{ rows: 4 }} />
      </div>
    );
  }

  // Component renderer
  const renderComponent = (component: UIComponent): React.ReactNode => {
    // Check visibility
    if (component.visible === false) return null;
    
    // Get data for this component if available
    const componentData = data[component.id] || {};
    
    // Render based on component type
    switch (component.type) {
      case 'text': {
        const { content, variant = 'p', style, ...rest } = component;
        const finalContent = componentData.content || content;
        
        switch (variant) {
          case 'h1':
            return <Title level={1} {...rest}>{finalContent}</Title>;
          case 'h2':
            return <Title level={2} {...rest}>{finalContent}</Title>;
          case 'h3':
            return <Title level={3} {...rest}>{finalContent}</Title>;
          case 'h4':
            return <Title level={4} {...rest}>{finalContent}</Title>;
          case 'span':
            return <Text {...rest}>{finalContent}</Text>;
          default:
            return <Paragraph {...rest}>{finalContent}</Paragraph>;
        }
      }
      
      case 'button': {
        const { content, variant = 'primary', style, events, ...rest } = component;
        
        const handleClick = () => {
          if (events?.click) {
            handleAction(events.click.action, events.click.payload);
          }
        };
        
        let buttonType: "primary" | "default" | "dashed" | "link" | "text" = "default";
        let danger = false;
        
        switch (variant) {
          case 'primary':
            buttonType = 'primary';
            break;
          case 'outline':
            buttonType = 'default';
            break;
          case 'ghost':
            buttonType = 'text';
            break;
          case 'destructive':
            buttonType = 'primary';
            danger = true;
            break;
          default:
            buttonType = 'default';
        }
        
        return (
          <Button 
            type={buttonType}
            danger={danger}
            onClick={handleClick}
            style={style}
            {...rest}
          >
            {content}
          </Button>
        );
      }
      
      case 'input': {
        const { 
          name, 
          label, 
          placeholder, 
          defaultValue, 
          inputType = 'text',
          validation,
          style,
          ...rest
        } = component;
        
        const value = formState[name] !== undefined 
          ? formState[name] 
          : (componentData.defaultValue || defaultValue || '');
        
        const inputComponent = inputType === 'textarea' ? (
          <TextArea
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            style={{ minHeight: 120, ...style }}
            {...rest}
          />
        ) : (
          <Input
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={(e) => handleInputChange(name, e.target.value)}
            style={style}
            {...rest}
          />
        );
        
        return (
          <Form.Item
            label={label}
            name={name}
            rules={validation?.required ? [{ required: true, message: `${label} is required` }] : undefined}
          >
            {inputComponent}
          </Form.Item>
        );
      }
      
      case 'card': {
        const { children, style, ...rest } = component;
        
        return (
          <Card style={style} {...rest}>
            {children.map((child) => (
              <div key={child.id}>{renderComponent(child)}</div>
            ))}
          </Card>
        );
      }
      
      case 'list': {
        const { items, layout = 'vertical', style, ...rest } = component;
        
        // Get dynamically loaded items if available
        const listItems = componentData.items || items || [];
        
        const itemsList = listItems.map((item) => (
          <div key={item.id} style={{ width: '100%' }}>
            {renderComponent(item)}
          </div>
        ));
        
        if (layout === 'horizontal') {
          return (
            <div style={{ display: 'flex', overflowX: 'auto', gap: 16, ...style }} {...rest}>
              {itemsList}
            </div>
          );
        } else if (layout === 'grid') {
          return (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: 16,
              ...style 
            }} {...rest}>
              {itemsList}
            </div>
          );
        }
        
        // Default to vertical
        return (
          <Space direction="vertical" style={{ width: '100%', ...style }} {...rest}>
            {itemsList}
          </Space>
        );
      }
      
      case 'container': {
        const { children, style, ...rest } = component;
        
        return (
          <div style={style} {...rest}>
            {children.map((child) => (
              <div key={child.id}>{renderComponent(child)}</div>
            ))}
          </div>
        );
      }
      
      case 'form': {
        const { 
          children, 
          submitLabel = 'Submit', 
          cancelLabel,
          style,
          events,
          ...rest 
        } = component;
        
        const handleSubmit = () => {
          if (events?.submit) {
            handleFormSubmit(events.submit.action, events.submit.payload);
          }
        };
        
        const handleCancel = () => {
          if (events?.cancel) {
            handleAction(events.cancel.action, events.cancel.payload);
          }
        };
        
        return (
          <Form 
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            style={style}
            {...rest}
          >
            {children.map((child) => (
              <div key={child.id}>{renderComponent(child)}</div>
            ))}
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  {submitLabel}
                </Button>
                {cancelLabel && (
                  <Button onClick={handleCancel}>
                    {cancelLabel}
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        );
      }

      case 'image': {
        const { src, alt, width, height, style, ...rest } = component;
        
        return (
          <AntImage 
            src={componentData.src || src} 
            alt={componentData.alt || alt}
            width={width} 
            height={height}
            style={style}
            {...rest}
          />
        );
      }
      
      default:
        return <div>Unknown component type: {(component as any).type}</div>;
    }
  };

  return (
    <div className="ui-renderer">
      {schema.components.map((component) => (
        <div key={component.id}>{renderComponent(component)}</div>
      ))}
    </div>
  );
};

export default UIRenderer;
