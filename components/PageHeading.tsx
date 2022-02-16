import { ReactNode } from 'react';

interface PageHeadingProps {
  title?: ReactNode;
  actions?: ReactNode[];
}

const PageHeading = ({ title, actions = [] }: PageHeadingProps) => {
  return (
    <div className="md:flex md:items-center md:justify-between">
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4 gap-3">
        {actions.map((item) => item)}
      </div>
    </div>
  );
};

export default PageHeading;
