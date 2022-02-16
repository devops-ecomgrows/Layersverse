import Link from 'next/link';
import React, { SVGProps } from 'react';

function SideBar({
  sidebarNavigation,
  classNames,
}: {
  sidebarNavigation: {
    name: string;
    href: string;
    icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    current: boolean;
  }[];
  classNames: (...classes: string[]) => string;
}) {
  return (
    <nav
      aria-label="Sidebar"
      className="hidden md:block md:flex-shrink-0 md:bg-gray-800 md:overflow-y-auto"
    >
      <div className="relative w-20 flex flex-col p-3 space-y-3">
        {sidebarNavigation.map((item, idx) => (
          <Link key={idx} href={item.href} passHref>
            <div
              key={item.name}
              className={classNames(
                item.current
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-400 hover:bg-gray-700',
                'flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-lg cursor-pointer',
              )}
              title={item.name}
            >
              <span className="sr-only">{item.name}</span>
              <item.icon className="h-6 w-6" aria-hidden="true" />
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default SideBar;
