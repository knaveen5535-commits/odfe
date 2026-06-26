import React, { HTMLAttributes } from 'react';
import styles from './Card.module.scss';
import clsx from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
  interactive?: boolean;
  compact?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  interactive,
  compact,
  className,
  ...props
}) => {
  return (
    <div
      className={clsx(
        styles.card,
        variant === 'glass' && styles.glass,
        interactive && styles.interactive,
        compact && styles.compact,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
