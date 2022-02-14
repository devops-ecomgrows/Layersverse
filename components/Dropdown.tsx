import { Menu, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

interface DropdownProps {
  /**
   * Menu item list
   */
  menus: ReactNode[];
  /**
   * Menu activator
   */
  menuBtn: ReactNode;
  /**
   * Dropdown position
   */
  position: 'left' | 'right';
  /**
   * The class name of the container of the dropdown
   */
  className?: string;
  /**
   * Dropdown disabling
   */
  disable?: boolean;
}

const Dropdown = ({
  menus,
  position = 'left',
  menuBtn,
  className,
  disable = false,
}: DropdownProps) => {
  return (
    <Menu
      as="div"
      className={`pg-dropdown relative inline-block text-left ${
        className ? className : ''
      } ${disable ? 'text-gray-400' : ''}`}
    >
      <div className="pg-dropdown-activate-container">{menuBtn}</div>
      {!disable ? (
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`pg-dropdown-list origin-top-right absolute ${position}-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none`}
          >
            {menus.map((menu, idx) => (
              <div className="pg-dropdown-item py-1" key={idx}>
                {menu}
              </div>
            ))}
          </Menu.Items>
        </Transition>
      ) : null}
    </Menu>
  );
};

export default Dropdown;
