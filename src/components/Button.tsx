import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger';
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ variant = 'primary', children, ...props }: Readonly<ButtonProps>) {
  const baseClasses = 'px-4 py-2 rounded focus:outline-none';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

