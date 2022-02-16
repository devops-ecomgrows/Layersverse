import { Tab } from '@headlessui/react';
import { ReactNode } from 'react';

interface TabProps {
  name: string;
  content: ReactNode;
}

interface TabsProps {
  /**
   * Tab list
   */
  tabs: TabProps[];
  /**
   * The class name of the container of the tabs
   */
  className?: string;
  /**
   * On change tab handler
   */
  onChange?: (idx: number) => void;
  /**
   * Default selected tab
   */
  defaultValue?: number;
}

const Tabs = ({ tabs, className, onChange, defaultValue }: TabsProps) => {
  return (
    <div className={`pg-tabs ${className || ''}`}>
      <Tab.Group
        defaultIndex={defaultValue}
        onChange={(index) => {
          onChange && onChange(index);
        }}
      >
        <Tab.List>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab, index) => (
                <Tab
                  key={index}
                  className={({ selected }) =>
                    [
                      'pg-tab-item',
                      selected
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                      'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                      'printgrows-tab',
                    ].join(' ')
                  }
                >
                  {tab.name}
                </Tab>
              ))}
            </nav>
          </div>
        </Tab.List>
        <Tab.Panels>
          {tabs.map((tab, idx) => (
            <Tab.Panel key={idx} className={`printgrows-tab-panel`}>
              {tab.content}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
