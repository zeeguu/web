import { useHistory } from "react-router-dom";
import * as s from "./BackArrow.sc";

export default function BackArrow({ redirectLink, func }) {
  /*
    Within the Web, the back button usually navigates the user backwards in
    the history of the browser, or redirects them to a new location.

    However, there might be cases where the back button hides a modal or
    shouldn't navigate the user through links. For example, the extension
    relies on showing/hiding components, so we need a way to set a state
    via this button. If func() is defined, tehn we call that function,
    otherwise, history is used.
  */
  const history = useHistory();

  return (
    <s.BackArrow onClick={() => (func ? func() : redirectLink ? history.push(redirectLink) : history.goBack())}>
      <svg width="9" height="15" viewBox="0 0 9 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.292893 6.65666C-0.097631 7.04719 -0.097631 7.68035 0.292893 8.07088L6.65685 14.4348C7.04738 14.8254 7.68054 14.8254 8.07107 14.4348C8.46159 14.0443 8.46159 13.4111 8.07107 13.0206L2.41421 7.36377L8.07107 1.70692C8.46159 1.31639 8.46159 0.683226 8.07107 0.292702C7.68054 -0.0978227 7.04738 -0.0978227 6.65685 0.292702L0.292893 6.65666ZM3 7.36377V6.36377H1V7.36377L1 8.36377H3V7.36377Z" fill="var(--text-secondary)"/>
      </svg>
    </s.BackArrow>
  );
}
