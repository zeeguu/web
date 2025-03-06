import { useState } from "react";
import { checkExtensionInstalled } from "../utils/extension/extensionCommunication";
import {
  runningInChromeDesktop,
  runningInFirefoxDesktop,
} from "../utils/misc/browserDetection";
import { useEffect } from "react";

export default function useExtensionCommunication() {
  // active session duration is measured in seconds
  // The DB stored the exercise time in ms we need to convert it
  // to MS.
  const [isExtensionAvailable, setIsExtensionAvailable] = useState();
  useEffect(() => {
    if (!runningInChromeDesktop() && !runningInFirefoxDesktop()) {
      setIsExtensionAvailable(false);
    } else {
      checkExtensionInstalled(setIsExtensionAvailable);
    }
  }, []);

  return [isExtensionAvailable];
}
