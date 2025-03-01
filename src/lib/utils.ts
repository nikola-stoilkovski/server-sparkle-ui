
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { UIComponent, UISchema } from "@/types";

// Utility to merge Tailwind CSS classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date in a user-friendly way
export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  
  // Use relative time for recent dates
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 172800) {
    return 'yesterday';
  }
  
  // Format date for older entries
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: now.getFullYear() !== date.getFullYear() ? 'numeric' : undefined
  });
}

// Server-driven UI utilities
export function findComponentById(schema: UISchema, id: string): UIComponent | null {
  const search = (components: UIComponent[]): UIComponent | null => {
    for (const component of components) {
      if (component.id === id) {
        return component;
      }
      
      // Search in nested components
      if ('children' in component) {
        const found = search(component.children);
        if (found) return found;
      }
      
      if ('items' in component) {
        const found = search(component.items);
        if (found) return found;
      }
    }
    
    return null;
  };
  
  return search(schema.components);
}

export function updateComponentById(
  schema: UISchema, 
  id: string, 
  update: Partial<UIComponent>
): UISchema {
  const updateInArray = (components: UIComponent[]): UIComponent[] => {
    return components.map(component => {
      if (component.id === id) {
        return { ...component, ...update };
      }
      
      // Update in nested components
      if ('children' in component) {
        return {
          ...component,
          children: updateInArray(component.children)
        };
      }
      
      if ('items' in component) {
        return {
          ...component,
          items: updateInArray(component.items)
        };
      }
      
      return component;
    });
  };
  
  return {
    ...schema,
    components: updateInArray(schema.components)
  };
}

// Generate animation classes with delay based on index
export function getStaggeredAnimationClass(index: number, animation: string = 'fade-in'): string {
  const baseDelay = 50; // ms
  const delay = baseDelay * (index % 10); // Cap at 10 items to avoid too long delays
  
  return `animate-${animation} [animation-delay:${delay}ms] [animation-fill-mode:both]`;
}

// Helper to truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}
