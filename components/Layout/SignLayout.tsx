import Image from "next/image";

function SignLayout({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div className="h-screen bg-white">
      <div className="min-h-full flex h-full">
        {children}
        <div className="hidden lg:block relative w-0 flex-1">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1505904267569-f02eaeb45a4c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
            alt=""
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
}

export default SignLayout;
