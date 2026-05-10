import * as s from "./TranslationPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { StyledButton } from "../../../components/allButtons.sc";
import { useContext } from "react";
import { APIContext } from "../../../contexts/APIContext";

export default function TranslationPopup({ open, handleCancel, onboardingMessageId, onContinue }) {
    const api = useContext(APIContext);

    const handleContinue = async () => {
        if (onboardingMessageId) {
            try {
                await api.setOnboardingMessageClickTime(onboardingMessageId);
            } catch (e) {
                // ignore click recording failures
            }
        }
        if (onContinue) onContinue();
        else if (handleCancel) handleCancel();
    };

    return (
        <Modal open={open} onClose={handleCancel} wrapperBackgroundColor="#fff1d4" hideCloseButton>
            <s.TranslationImage src="/static/images/translate.png" alt="Translation illustration" />
            <Main>
                <p style={{ textAlign: "center", fontWeight: "500" }}>
                    Tap on any word to translate it. <br/> Add at least 3 words to start learning them.
                </p>
            </Main>
            <Footer>
                <ButtonContainer $buttonCountNum={1}>
                    <StyledButton $onboarding onClick={handleContinue} style={{ minWidth: "190px", margin: "0 auto"}}>
                        Continue
                    </StyledButton>
                </ButtonContainer>
            </Footer>
        </Modal>
    );
}