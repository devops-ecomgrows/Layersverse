import { ExclamationIcon } from '@heroicons/react/outline';
import { ReactNode } from 'react';

interface AlertsProps {
  /**
   * The class name of the container of the card
   */
  className?: string;
  /**
   * Card Content
   */
  children?: ReactNode;
  /**
   * Alert Type
   */
  type?: 'success' | 'error' | 'warning';
}

const Alerts = ({ className, children, type }: AlertsProps) => {
  let color = 'green';
  switch (type) {
    case 'error':
      color = 'red';
      break;
    case 'warning':
      color = 'yellow';
      break;
  }
  return (
    <div
      className={`text-${color}-600 leading-9 bg-${color}-100 p-3 rounded-md`}
    >
      <div className="flex gap-2">
        <ExclamationIcon className="w-5" />
        <h3 className={`text-base font-medium text-${color}-800`}>Warning</h3>
      </div>
      <div className={className}>{children}</div>
    </div>
  );
};

export default Alerts;
