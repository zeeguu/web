import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { ZeeguuShield, nativeShieldAvailable } from "../components/nativeShield";
import onAppResume from "../utils/misc/onAppResume";

// Opens /aiki when the learner just pressed "Learn in Zeeguu" on the shield:
// the shield leaves a note (Aiki.swift), taken here on start and on resume.
export default function useOpenAikiOnRequest() {
  const history = useHistory();

  useEffect(() => {
    if (!nativeShieldAvailable()) return;
    const check = () =>
      ZeeguuShield.takeOpenAikiRequest()
        .then(({ open }) => open && history.push("/aiki"))
        .catch(() => {});
    check();
    return onAppResume(check);
  }, [history]);
}
