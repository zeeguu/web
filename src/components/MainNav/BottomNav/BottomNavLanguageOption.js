import { useState } from "react";
import LanguageModal from "../LanguageModal";
import BottomNavOption from "./BottomNavOption";
import NavIcon from "../NavIcon";

export default function BottomNavLanguageOption() {
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  return (
    <>
      <BottomNavOption
        ariaHasPopup={"dialog"}
        icon={<NavIcon name="language" />}
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
