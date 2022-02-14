import { useEffect, useMemo, useState } from 'react';
import {
  ServerIcon,
  LightBulbIcon,
  ShoppingBagIcon,
  UsersIcon,
} from '@heroicons/react/outline';
import TopNav from './TopNav';
import router from 'next/router';
import SideBar from './SideBar';
import DefaultAvatar from '../../public/icon/avatar.png';
import { useSelector } from 'react-redux';
import { RootState } from 'reduxstore';
import { USER_ROLE } from 'constants/auth';
import produce from 'immer';

const user = {
  name: 'Whitney Francis',
  email: 'whitneyfrancis@example.com',
  imageUrl: DefaultAvatar,
};

const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Sign out', href: '#' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const sidebarNavigation = [
  {
    name: 'List Ideas',
    href: '/ideas',
    icon: LightBulbIcon,
    current: true,
  },
  { name: 'Orders', href: '/orders', icon: ShoppingBagIcon, current: false },
  {
    name: 'Connect Store',
    href: '/connect',
    icon: ServerIcon,
    current: false,
  },
];

const adminNavigation = [
  {
    name: 'User',
    href: '/user',
    icon: UsersIcon,
    current: false,
  },
];
export default function MainMenu({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const path = router.pathname;
  const [pathSelected, setPathSelected] = useState('');
  const role = useSelector((state: RootState) => state.user);
  const [nav, setNav] = useState(sidebarNavigation);

  useEffect(() => {
    const nextState = produce(nav, (draftState) => {
      draftState.forEach((item) => {
        if (item.href === path) {
          item.current = true;
          setPathSelected(item.name);
        } else {
          item.current = false;
        }
      });
    });

    setNav(nextState);
  }, [path, nav]);

  useEffect(() => {
    if (role === USER_ROLE.ADMIN) {
      setNav([...sidebarNavigation, ...adminNavigation]);
    } else {
      setNav(sidebarNavigation);
    }
  }, [role]);

  return (
    <div className="h-screen ">
      <div className="h-full flex flex-col bg-gray-100 overflow-hidden">
        {/* Top nav*/}
        <TopNav
          sidebarNavigation={nav}
          setMobileMenuOpen={setMobileMenuOpen}
          mobileMenuOpen={mobileMenuOpen}
          classNames={classNames}
          user={user}
          userNavigation={userNavigation}
        />

        {/* Bottom section */}
        <div className="min-h-0 flex-1 flex">
          {/* Narrow sidebar*/}
          <SideBar sidebarNavigation={nav} classNames={classNames} />
          {/* Main area */}
          <div className="min-w-0 flex-1 border-t border-gray-200 lg:flex overflow-auto">
            <div className="h-full max-w-7xl w-full m-auto mt-10">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
