import React from 'react';

interface LoaderProps {
  fullScreen?: boolean;
  size?: number;
  text?: string;
  color?: string;
}

export const Loader = ({
  fullScreen = true,
  size = 40,
  text,
  color = 'border-blue-600',
}: LoaderProps) => {
  
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-content bg-background/80 backdrop-blur-sm justify-center'
    : 'w-full h-full min-h-[100px] flex flex-col items-center justify-center';

  return (
    <div className={containerClasses} aria-label="Cargando contenido">
      <div className="relative flex flex-col items-center gap-3">
        
        <div
          className={`animate-spin rounded-full border-4 border-muted/30 ${color}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderTopColor: 'transparent',
          }}
        />
        
        {text && (
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );
};