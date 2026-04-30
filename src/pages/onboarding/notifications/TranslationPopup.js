import * as s from "./TranslationPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { StyledButton } from "../../../components/allButtons.sc";

export default function TranslationPopup({ open, handleCancel, article }) {
    return (
        <Modal open={open} onClose={handleCancel} wrapperBackgroundColor="#fff1d4" >
            <s.TranslationImage src="/static/images/translate.png" alt="Translation illustration" />
            <Main>
                <p style={{ textAlign: "center", fontWeight: "500" }}>
                    Tap on any word to translate it. Add at least 3 words to start learning them.
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