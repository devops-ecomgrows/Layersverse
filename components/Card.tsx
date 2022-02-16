import { ReactNode } from 'react';

interface CardProps {
  /**
   * The class name of the container of the card
   */
  className?: string;
  /**
   * Card Content
   */
  children?: ReactNode;
}

const Card = ({ className, children }: CardProps) => {
  return (
    <div className={`bg-white shadow rounded-lg ${className ? className : ''}`}>
      {children}
    </div>
  );
};

// eslint-disable-next-line react/display-name
Card.Content = ({ className, children }: CardProps) => {
  return (
    <div className={`px-4 py-5 sm:p-6 ${className ? className : ''}`}>
      {children}
    </div>
  );
};

export default Card;
