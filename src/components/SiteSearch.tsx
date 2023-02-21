import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Site } from "@prisma/client";
import classNames from "classnames";
import { ChangeEvent, FC, useState } from "react";

type SiteSearchProps = {
  onSelect: (site: Site) => void;
  disabled?: boolean;
};

const SiteSearch: FC<SiteSearchProps> = ({ onSelect, disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-sky-200 rounded-md flex-col">
      <div className={classNames("rounded-t-md flex flex-row")}>
        <input
          type="text"
          placeholder="Search for a site"
          className="bg-transparent border-none rounded-tl-md px-4 py-3 focus:ring-0 focus:ring-offset-0 flex-grow"
          value={searchTerm}
          onChange={(e: ChangeEvent) => 
            setSearchTerm((e.target as HTMLInputElement).value)}
        />
        <div className="px-3.5 py-3">
          <FontAwesomeIcon icon={faMagnifyingGlass} fixedWidth />
        </div>
      </div>
    </div>
  );
};

export default SiteSearch;

