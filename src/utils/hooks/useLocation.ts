import { useContext } from "react";
import LocationContext from "../contexts/location";

function useLocation() {
  return useContext(LocationContext);
}

export default useLocation;
