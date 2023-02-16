import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, PropsWithChildren } from "react";

type AdminListProps = {
  create: () => void;
} & PropsWithChildren;

const AdminList: FC<AdminListProps> = ({ children, create }) => {
  return (
    <div className="flex flex-grow flex-col gap-4 p-4">    
      <button className="flex flex-row gap-2 items-center justify-center bg-sky-500 hover:bg-sky-600 rounded-md px-4 py-3 text-white" onClick={create}>
        <FontAwesomeIcon fixedWidth icon={faPlus} />
        Create
      </button>
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminList;

