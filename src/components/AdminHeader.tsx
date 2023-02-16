import { FC, PropsWithChildren } from "react";

const AdminHeader: FC<PropsWithChildren> = ({ children }) => {
  return (
    <nav className="bg-sky-200 px-2 py-1.5">
      {children}
    </nav>
  );
};

export default AdminHeader;

