import React from 'react';
import { Link } from 'react-router-dom';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  to,
  href,
  className = '',
  disabled = false,
  icon: Icon,
  iconPosition = 'left',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold uppercase tracking-wider transition-all duration-300 rounded-military disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-army-gold/60 focus:ring-offset-2 focus:ring-offset-army-black select-none';

  const variantStyles = {
    primary: 'bg-army-gold text-army-maroon hover:bg-army-gold-light active:bg-army-gold-soft shadow-[0_4px_14px_rgba(217,156,43,0.35)] hover:shadow-[0_6px_20px_rgba(217,156,43,0.5)] font-bold border border-army-gold-light/40',
    secondary: 'bg-transparent text-army-gold border border-army-gold/70 hover:border-army-gold hover:bg-army-gold/10 active:bg-army-gold/20 shadow-sm',
    ghost: 'bg-transparent text-army-ivory hover:text-army-gold hover:bg-white/5',
    danger: 'bg-army-red text-army-white hover:bg-army-red-light border border-army-red-light',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3 text-base gap-2.5',
  };

  const combinedClasses = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
      {Icon && iconPosition === 'right' && <Icon className="w-4 h-4 shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button className={combinedClasses} disabled={disabled} {...props}>
      {content}
    </button>
  );
}

export default Button;
