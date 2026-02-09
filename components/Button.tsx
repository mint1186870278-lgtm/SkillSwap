import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'white';
  size?: 'md' | 'lg';
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'lg', 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-full transition-all duration-300 transform active:scale-95 focus:outline-none focus:ring-4 focus:ring-white/50";
  
  const variants = {
    primary: "bg-white/80 backdrop-blur-md text-textMain shadow-lg hover:bg-white hover:shadow-xl hover:-translate-y-1 border border-white",
    secondary: "bg-textMain text-white shadow-lg hover:bg-black hover:shadow-xl hover:-translate-y-1",
    white: "bg-white text-textMain shadow-md hover:shadow-lg hover:-translate-y-1",
    glass: "glass-card text-textMain hover:bg-white/70"
  };

  const sizes = {
    md: "px-6 py-3 text-sm tracking-wide",
    lg: "px-10 py-4 text-base tracking-wide"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;