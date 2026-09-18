import React from 'react';

export function Container({ children, className = '', as: Component = 'div', ...props }) {
  return (
    <Component
      className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-8 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Container;
