import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

type AdminListProps = {
  create: string;
} & PropsWithChildren;

const AdminList: FC<AdminListProps> = ({ children, create }) => {
  return (
    <div className="flex flex-grow flex-col gap-4 p-4">
      <Link
        href={create}
        className="flex flex-row items-center justify-center gap-2 rounded-md bg-sky-500 px-4 py-3 text-white hover:bg-sky-600"
      >
        <FontAwesomeIcon fixedWidth icon={faPlus} />
        Create
      </Link>
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminList;
