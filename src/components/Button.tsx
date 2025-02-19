import React from 'react';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger' | 'warn' | 'clear';
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({variant = 'primary', children, ...props}: Readonly<ButtonProps>) {
  const variantClasses = {
    primary: 'border-blue-600 bg-blue-500 text-white hover:bg-blue-600 ',
    secondary: 'border-gray-600 bg-gray-500 text-white hover:bg-gray-600',
    danger: 'border-red-600 bg-red-500 text-white hover:bg-red-600',
    warn: 'border-orange-600 bg-orange-500 text-white hover:bg-orange-600',
    clear: 'bg-transparent text-black hover:bg-gray-100'
  };

  return (
    <button
      className={`px-4 py-2 rounded focus:outline-none hover:cursor-pointer disabled:border-gray-500 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed ${variantClasses[variant]}`} {...props}>
      {children}
    </button>
  );
};

