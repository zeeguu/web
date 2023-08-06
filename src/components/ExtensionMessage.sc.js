import { ModalWrapper } from "./ModalWrapper.sc"; //factored out MyBox
import styled from "styled-components";

//TODO: after deciding on the final modal styling - this file and the RedirectionNotificationModal.sc
//could be merged together into one universal component

//TODO: Rename const MyBox
const MyBox = styled(ModalWrapper)`
  .newAnnotation {
    color: orange;
    font-weight: 500;
  }

  .installLinks {
    text-align: center;
  }
`;

const StyledCloseButton = styled.div`
  cursor: pointer;
  padding: 1px;
  text-align: right;
  position: absolute;
  float: right;
  right: 16px;
  margin-top: -15px;
`;

export { MyBox, StyledCloseButton };
