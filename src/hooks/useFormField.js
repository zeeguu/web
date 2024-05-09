import { useState } from "react";
/*
A custom hook controlling form field logic.
It could be extended with:
    - validation support (a function with validation rules could be passed as an argument)
    - error message states 
*/

export default function useFormField(initialState) {
  const [currentState, setState] = useState(initialState);

  function handleInputChange(e) {
    setState(e.target.value);
  }

  function resetInputState() {
    setState("");
  }

  return [currentState, handleInputChange, resetInputState];
}
