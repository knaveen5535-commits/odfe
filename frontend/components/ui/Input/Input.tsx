'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';
import styles from './Input.module.scss';
import clsx from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, fullWidth, className, id, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className={clsx(styles.wrapper, fullWidth && styles.fullWidth, className)}>
        {label && <label htmlFor={inputId} className={styles.label}>{label}</label>}
        <div className={clsx(styles.inputWrapper, error && styles.hasError, leftIcon && styles.hasLeftIcon, rightIcon && styles.hasRightIcon)}>
          {leftIcon && <span className={styles.iconLeft}>{leftIcon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={clsx(styles.input, props.className)}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...props}
          />
          {rightIcon && <span className={styles.iconRight}>{rightIcon}</span>}
        </div>
        {error && <p id={`${inputId}-error`} className={styles.errorText} role="alert">{error}</p>}
        {helperText && !error && <p id={`${inputId}-helper`} className={styles.helperText}>{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';