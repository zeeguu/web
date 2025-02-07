import { useState } from "react";
import LanguageModal from "../LanguageModal";
import NavOption from "../NavOption";
import NavIcon from "../NavIcon";

export default function SideNavLanguageOption() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  return (
    <>
      <NavOption
        ariaHasPopup={"dialog"}
        icon={<NavIcon name={"language"} />}
        text={"Language"}
        onClick={(e) => {
          e.stopPropagation();
          setShowLanguageModal(!showLanguageModal);
        }}
      />
      <LanguageModal
        prefixMsg={"Sidebar"}
        open={showLanguageModal}
        setOpen={() => {
          setShowLanguageModal(!showLanguageModal);
        }}
      ></LanguageModal>
    </>
  );
}
