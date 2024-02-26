import { useEffect, useRef } from "react";

// A shadow ref is a ref that tracks an already existing state variable; like the shadow government in the UK? :)

// This monstrosity of a hook is needed such that we can hold onto a variable until the component unmounts
// Otherwise, state variables are not available in the unmount function!
// Inspired from: https://www.timveletta.com/blog/2020-07-14-accessing-react-state-in-your-component-cleanup-with-hooks/

export default function useShadowRef(varToShadow) {
  const ref = useRef();
  useEffect(() => {
    ref.current = varToShadow;
  }, [varToShadow]);
  return ref;
}
