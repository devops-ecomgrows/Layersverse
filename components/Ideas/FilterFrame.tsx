import { Disclosure } from '@headlessui/react';
import { Button } from 'components/Button/Button';
import { Dispatch, ReactNode, SetStateAction } from 'react';

const FilterFrame = ({
  label,
  expanded,
  setExpanded,
  children,
}: {
  label: string;
  expanded: boolean;
  setExpanded: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
}) => {
  return (
    <>
      {expanded && (
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-0 transition-opacity z-10"
          aria-hidden="true"
          onClick={() => {
            setExpanded(false);
          }}
        ></div>
      )}
      <div className="relative">
        <Button
          label={label}
          className="max-h-[38px] items-end mt-1 min-w-[100px]"
          onClick={() => setExpanded(true)}
        ></Button>
        <div className="bg-white top-12 left-0 filter-by-option absolute">
          <Disclosure
            as="section"
            aria-labelledby="filter-heading"
            className="relative z-10 border-gray-200 grid items-center"
          >
            {expanded ? (
              <div className="div-expanded bg-white mt-2 border-1 expanded-filter shadow-lg rounded-md">
                <div className="bg-gray-100 rounded-t-md">
                  <div className="mr-2.5">
                    <Button
                      size="small"
                      label="Done"
                      className="my-2.5 ml-40"
                      onClick={() => setExpanded(false)}
                    ></Button>
                  </div>
                </div>
                <div className="max-w-7xl mx-auto gap-x-4 px-4 text-sm">
                  <div className="grid grid-cols-1 gap-y-4 auto-rows-min">
                    <fieldset>
                      <div className="pt-3 space-y-4">{children}</div>
                    </fieldset>
                  </div>
                </div>
              </div>
            ) : null}
          </Disclosure>
        </div>
      </div>
    </>
  );
};

export default FilterFrame;
