import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Site } from "@prisma/client";
import classNames from "classnames";
import { ChangeEvent, FC, useState } from "react";
import siteSearchStyles from '../styles/components/SiteSearch.module.scss';
import { api } from "../utils/api";

type SiteSearchProps = {
  onSelect: (site: Site) => void;
  disabled?: boolean;
};

const SiteSearch: FC<SiteSearchProps> = ({ onSelect, disabled = false }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const searchSite = api.sites.search.useQuery({ query: searchTerm });

  function selectSite(site: Site) {
    setSearchTerm('');
    onSelect(site);
  }

  return (
    <div className={classNames(siteSearchStyles.siteSearch, {
      [`${siteSearchStyles.open}`]: searchTerm !== '',
    })}>
      <div className={siteSearchStyles.inputBar}>
        <input
          type="text"
          placeholder="Search for a site"
          disabled={disabled}
          className={siteSearchStyles.input}
          value={searchTerm}
          onChange={(e: ChangeEvent) => {
            setSearchTerm((e.target as HTMLInputElement).value);
            searchSite.refetch();
          }}
        />
        <div className="px-3.5 py-3">
          <FontAwesomeIcon icon={faMagnifyingGlass} fixedWidth />
        </div>
      </div>
      <div className={siteSearchStyles.siteList}>
        {searchSite.data && searchSite.data.map(site => 
          <div
            className={siteSearchStyles.site}
            onClick={() => selectSite(site)}
          >
            {site.name !== null ? <>
              <span className="font-bold">{site.name}</span>
              <span>{site.address}</span>
            </> : <span className="font-bold">{site.address}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteSearch;

