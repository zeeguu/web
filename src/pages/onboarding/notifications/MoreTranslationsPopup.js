import * as s from "./MoreTranslationsPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { StyledButton } from "../../../components/allButtons.sc";

export default function MoreTranslationsPopup({ open, handleCancel, article }) {
    return (
        <Modal open={open} onClose={handleCancel} wrapperBackgroundColor="#fff1d4" >
            <s.MoreTranslationImage src="/static/images/MoreTranslation.png" alt="See more translations illustration" />
            <Main>
                <p style={{ textAlign: "center", fontWeight: "500" }}>
                    Press  <s.ArrowIcon src="/static/icons/ArrowDown.svg" alt="Arrow icon" />    to see more translation options, to unselect a word press <s.DeleteTranslationText>Delete translation.</s.DeleteTranslationText>
                </p>
            </Main>
            <Footer>
                <ButtonContainer $buttonCountNum={1}>
                    <StyledButton $onboarding onClick={handleCancel} style={{ minWidth: "190px", margin: "0 auto"}}>
                        Continue
                    </StyledButton>
                </ButtonContainer>
            </Footer>
        </Modal>
    );
}