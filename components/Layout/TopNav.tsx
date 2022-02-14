import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  XIcon,
} from '@heroicons/react/outline';
import React, {
  Dispatch,
  Fragment,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SideBarMenu } from '../../interface/layout';
import Image from 'next/image';
import useAuth from '../../hooks/useAuth';
import Notification from 'components/Notification/Notification';
import { ArchiveIcon } from '@heroicons/react/outline';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxstore';
import { supabase } from 'utils/supabaseClient';
import { User } from '@supabase/supabase-js';
import { PrivateAvatar } from 'components/PrivateAvatar';

function TopNav({
  sidebarNavigation,
  setMobileMenuOpen,
  classNames,
  mobileMenuOpen,
  user,
  userNavigation,
}: {
  sidebarNavigation: SideBarMenu[];
  setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
  classNames: (...classes: string[]) => string;
  mobileMenuOpen: boolean;
  user: {
    name: string;
    email: string;
    imageUrl: string | StaticImageData;
  };
  userNavigation: {
    name: string;
    href: string;
  }[];
}) {
  const { signOut } = useAuth();
  const store = useSelector((state: RootState) => state.storeSelected);
  const [userInfo, setUserInfo] = useState<User | null>();

  useEffect(() => {
    const user = supabase.auth.user();

    setUserInfo(user);
  }, []);

  const onSignOut = async () => {
    await signOut('/signin');
  };

  const StoreSelected = useMemo(() => {
    return store ? (
      <>
        <ArchiveIcon className="w-6 h-6"></ArchiveIcon>
        <p className="flex text-sm items-center">{store.store_name}</p>
      </>
    ) : (
      <></>
    );
  }, [store]);

  return (
    <header className="flex-shrink-0 relative h-16 bg-white flex items-center">
      {/* Logo area */}
      <div className="absolute inset-y-0 left-0 md:static md:flex-shrink-0">
        <a
          href="#"
          className="flex items-center justify-center h-16 w-16 bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600 md:w-20"
        >
          <Image
            className="h-8 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark.svg?color=white"
            alt="Workflow"
            width={30}
            height={30}
          />
        </a>
      </div>

      {/* Picker area */}
      <div className="mx-auto md:hidden">
        <div className="relative">
          <label htmlFor="inbox-select" className="sr-only">
            Choose inbox
          </label>
          <select
            id="inbox-select"
            className="rounded-md border-0 bg-none pl-3 pr-8 text-base font-medium text-gray-900 focus:ring-2 focus:ring-indigo-600"
            defaultValue={sidebarNavigation.find((item) => item.current)?.name}
          >
            {sidebarNavigation.map((item) => (
              <option key={item.name}>{item.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center pr-2">
            <ChevronDownIcon
              className="h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {/* Menu button area */}
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center sm:pr-6 md:hidden">
        {/* Mobile menu button */}
        <button
          type="button"
          className="-mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <MenuIcon className="block h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Desktop nav area */}
      <div className="hidden md:min-w-0 md:flex-1 md:flex md:items-center md:justify-between">
        <div className="pr-4 flex-shrink-0 flex items-center space-x-10 justify-end w-full">
          <div className="flex items-center space-x-8">
            <span className="flex gap-2">{StoreSelected}</span>
            <span className="inline-flex">
              <Notification className="-mx-1 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500" />
            </span>
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                <span className="sr-only">Open user menu</span>
                <PrivateAvatar
                  url={userInfo?.user_metadata.avatar_url}
                  width={40}
                  height={40}
                ></PrivateAvatar>
              </Menu.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute z-30 right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700',
                          )}
                        >
                          Your Profile
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          onClick={onSignOut}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700',
                          )}
                        >
                          Sign Out
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide this `div` based on menu open/closed state */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 md:hidden"
          onClose={setMobileMenuOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="hidden sm:block sm:fixed sm:inset-0 sm:bg-gray-600 sm:bg-opacity-75" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-out duration-150 sm:ease-in-out sm:duration-300"
            enterFrom="transform opacity-0 scale-110 sm:translate-x-full sm:scale-100 sm:opacity-100"
            enterTo="transform opacity-100 scale-100  sm:translate-x-0 sm:scale-100 sm:opacity-100"
            leave="transition ease-in duration-150 sm:ease-in-out sm:duration-300"
            leaveFrom="transform opacity-100 scale-100 sm:translate-x-0 sm:scale-100 sm:opacity-100"
            leaveTo="transform opacity-0 scale-110  sm:translate-x-full sm:scale-100 sm:opacity-100"
          >
            <nav
              className="fixed z-40 inset-0 h-full w-full bg-white sm:inset-y-0 sm:left-auto sm:right-0 sm:max-w-sm sm:w-full sm:shadow-lg"
              aria-label="Global"
            >
              <div className="h-16 flex items-center justify-between px-4 sm:px-6">
                <a href="#">
                  <Image
                    className="block h-8 w-8"
                    src="https://tailwindui.com/img/logos/workflow-mark.svg?color=indigo&shade=500"
                    alt="Workflow"
                    layout="fill"
                  />
                </a>
                <button
                  type="button"
                  className="-mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close main menu</span>
                  <XIcon className="block h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              <div className="mt-2 max-w-8xl mx-auto px-4 sm:px-6">
                <div className="relative text-gray-400 focus-within:text-gray-500">
                  <label htmlFor="mobile-search" className="sr-only">
                    Search all inboxes
                  </label>
                  <input
                    id="mobile-search"
                    type="search"
                    placeholder="Search all inboxes"
                    className="block w-full border-gray-300 rounded-md pl-10 placeholder-gray-500 focus:border-indigo-600 focus:ring-indigo-600"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                    <SearchIcon className="h-5 w-5" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="max-w-8xl mx-auto px-4 flex items-center sm:px-6">
                  <div className="flex-shrink-0">
                    <PrivateAvatar
                      url={userInfo?.user_metadata.avatar_url}
                      width={40}
                      height={40}
                    ></PrivateAvatar>
                  </div>
                  <div className="ml-3 min-w-0 flex-1">
                    <div className="text-base font-medium text-gray-800 truncate">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-500 truncate">
                      {user.email}
                    </div>
                  </div>
                  <Notification className="ml-auto flex-shrink-0 bg-white p-2 text-gray-400 hover:text-gray-500" />
                </div>
                <div className="mt-3 max-w-8xl mx-auto px-2 space-y-1 sm:px-4">
                  {userNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="block rounded-md py-2 px-3 text-base font-medium text-gray-900 hover:bg-gray-50"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </Transition.Child>
        </Dialog>
      </Transition.Root>
    </header>
  );
}

export default TopNav;
