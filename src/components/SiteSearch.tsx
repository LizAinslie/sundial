import { Site } from "@prisma/client";
import { ChangeEvent, FC, useState } from "react";

type SiteSearchProps = {
  onSelect: (site: Site) => void;
  disabled?: boolean;
};

const SiteSearch: FC<SiteSearchProps> = ({ onSelect, disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-sky-200 rounded-md flex-col">
      <div className="px-4 py-3 rounded-t-md border-b border-sky-300">
        <input
          type="text"
          placeholder="Search for a site"
          className="bg-transparent border-none rounded-tl-md"
          value={searchTerm}
          onChange={(e: ChangeEvent) => setSearchTerm((e.target as HTMLInputElement).value)}
        />
      </div>
    </div>
  );
};

export default SiteSearch;

