import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface CardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  clickable?: boolean;
  noPadding?: boolean;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> & {
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ children, className = '', clickable = false, noPadding = false, ...props }) => {
  return (
    <motion.div
      whileHover={clickable ? { scale: 1.01, y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={`
        relative rounded-xl border border-white/10
        bg-white/[0.03] backdrop-blur-xl
        shadow-lg shadow-black/10
        ${clickable ? 'cursor-pointer hover:border-white/20 hover:bg-white/[0.05]' : ''}
        ${noPadding ? '' : ''}
        transition-all duration-200
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`px-5 pt-5 pb-3 border-b border-white/5 ${className}`}>
    {children}
  </div>
);

const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`px-5 py-4 ${className}`}>{children}</div>
);

const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`px-5 pt-3 pb-5 border-t border-white/5 ${className}`}>
    {children}
  </div>
);

CardHeader.displayName = 'Card.Header';
CardBody.displayName = 'Card.Body';
CardFooter.displayName = 'Card.Footer';

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.displayName = 'Card';

export { Card };
export default Card;
