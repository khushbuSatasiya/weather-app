import { FC } from "react";
import CustomModal from "shared/modal/modal";

interface IProps {
  handlePopup: () => void;
}
const SearchPopUp: FC<IProps> = ({ handlePopup }) => {
  return (
    <div>
      <CustomModal show={true} className="search-popup">
        <div className="searchBox">
          <input type="text" className="searchInput" placeholder="Search.." />
          <div className="submitsearch">
            <span>Search</span>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default SearchPopUp;
