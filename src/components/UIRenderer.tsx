
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UIComponent, UISchema } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface UIRendererProps {
  schema?: UISchema;
  isLoading?: boolean;
  onAction: (action: string, payload?: any) => void;
  data?: Record<string, any>;
}

export const UIRenderer = ({ schema, isLoading, onAction, data = {} }: UIRendererProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formState, setFormState] = useState<Record<string, any>>({});
  
  // Update form state with data
  useEffect(() => {
    if (data && Object.keys(data).length) {
      setFormState(data);
    }
  }, [data]);

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
  const handleFormSubmit = (e: React.FormEvent, action: string, payload?: any) => {
    e.preventDefault();
    onAction(action, { ...payload, formData: formState });
  };

  // Render loading skeleton
  if (isLoading || !schema) {
    return (
      <div className="space-y-6 p-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-4 mt-8">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
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
        const { content, variant = 'p', className, ...rest } = component;
        const finalContent = componentData.content || content;
        
        switch (variant) {
          case 'h1':
            return <h1 className={cn("text-4xl font-bold", className)} {...rest}>{finalContent}</h1>;
          case 'h2':
            return <h2 className={cn("text-3xl font-bold", className)} {...rest}>{finalContent}</h2>;
          case 'h3':
            return <h3 className={cn("text-2xl font-bold", className)} {...rest}>{finalContent}</h3>;
          case 'h4':
            return <h4 className={cn("text-xl font-semibold", className)} {...rest}>{finalContent}</h4>;
          case 'span':
            return <span className={className} {...rest}>{finalContent}</span>;
          default:
            return <p className={className} {...rest}>{finalContent}</p>;
        }
      }
      
      case 'button': {
        const { content, variant = 'primary', className, events, ...rest } = component;
        
        const handleClick = () => {
          if (events?.click) {
            handleAction(events.click.action, events.click.payload);
          }
        };
        
        return (
          <Button 
            variant={variant as any} 
            className={className} 
            onClick={handleClick}
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
          className,
          ...rest
        } = component;
        
        const value = formState[name] !== undefined 
          ? formState[name] 
          : (componentData.defaultValue || defaultValue || '');
        
        return (
          <div className={cn("space-y-2", className)}>
            {label && <Label htmlFor={name}>{label}</Label>}
            
            {inputType === 'textarea' ? (
              <Textarea
                id={name}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleInputChange(name, e.target.value)}
                required={validation?.required}
                className="min-h-32 resize-y"
                {...rest}
              />
            ) : (
              <Input
                id={name}
                name={name}
                type={inputType}
                placeholder={placeholder}
                value={value}
                onChange={(e) => handleInputChange(name, e.target.value)}
                required={validation?.required}
                {...rest}
              />
            )}
          </div>
        );
      }
      
      case 'card': {
        const { children, className, ...rest } = component;
        
        return (
          <Card className={cn("overflow-hidden", className)} {...rest}>
            <div className="p-6">
              {children.map((child) => (
                <div key={child.id}>{renderComponent(child)}</div>
              ))}
            </div>
          </Card>
        );
      }
      
      case 'list': {
        const { items, layout = 'vertical', className, ...rest } = component;
        
        // Get dynamically loaded items if available
        const listItems = componentData.items || items || [];
        
        const layoutClasses = {
          vertical: "flex flex-col space-y-4",
          horizontal: "flex flex-row space-x-4 overflow-x-auto",
          grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
        };
        
        return (
          <div className={cn(layoutClasses[layout], className)} {...rest}>
            {listItems.map((item) => (
              <div key={item.id} className="w-full">
                {renderComponent(item)}
              </div>
            ))}
          </div>
        );
      }
      
      case 'container': {
        const { children, className, ...rest } = component;
        
        return (
          <div className={className} {...rest}>
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
          className, 
          events,
          ...rest 
        } = component;
        
        const handleSubmit = (e: React.FormEvent) => {
          if (events?.submit) {
            handleFormSubmit(e, events.submit.action, events.submit.payload);
          }
        };
        
        const handleCancel = () => {
          if (events?.cancel) {
            handleAction(events.cancel.action, events.cancel.payload);
          }
        };
        
        return (
          <form 
            className={className} 
            onSubmit={handleSubmit}
            {...rest}
          >
            {children.map((child) => (
              <div key={child.id}>{renderComponent(child)}</div>
            ))}
            
            <div className="flex justify-end space-x-2 mt-6">
              {cancelLabel && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                >
                  {cancelLabel}
                </Button>
              )}
              <Button type="submit">{submitLabel}</Button>
            </div>
          </form>
        );
      }

      case 'image': {
        const { src, alt, width, height, className, ...rest } = component;
        
        return (
          <img 
            src={componentData.src || src} 
            alt={componentData.alt || alt}
            width={width} 
            height={height}
            className={cn("rounded-md", className)}
            loading="lazy"
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
