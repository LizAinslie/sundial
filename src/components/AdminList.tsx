import { faPlus, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, PropsWithChildren } from "react";

type AdminListProps = {
  create: () => void;
  refresh: () => void;
} & PropsWithChildren;

const AdminList: FC<AdminListProps> = ({ children, create, refresh }) => {
  return (
    <div className="flex flex-grow flex-col gap-4 p-4">
      <div className="grid grid-cols-2 justify-items-stretch gap-4">
        <button className="flex flex-row gap-2 items-center justify-center bg-sky-200 hover:bg-sky-300 rounded-md px-4 py-3" onClick={refresh}>
          <FontAwesomeIcon fixedWidth icon={faRefresh} />
          Refresh
        </button>
        
        <button className="flex flex-row gap-2 items-center justify-center bg-sky-500 hover:bg-sky-600 rounded-md px-4 py-3 text-white" onClick={create}>
          <FontAwesomeIcon fixedWidth icon={faPlus} />
          Create
        </button>
      </div>
      <div className="flex flex-grow flex-col gap-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};

export default AdminList;

