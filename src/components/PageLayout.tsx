import { FC, PropsWithChildren } from "react";

const PageLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className="flex h-screen w-screen flex-col bg-sky-100 text-sky-900 overflow-y-auto">
      {children}
    </main>
  );
};

export default PageLayout;
