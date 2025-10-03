import React from 'react';
import { clsx } from 'clsx';
import { CardProps } from '../../types';

const Card: React.FC<CardProps> = ({
  title,
  description,
  className,
  children,
}) => {
  return (
    <div className={clsx('card p-6', className)}>
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold leading-none tracking-tight">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;