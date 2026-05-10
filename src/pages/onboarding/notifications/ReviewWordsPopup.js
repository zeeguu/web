import * as s from "./ReviewWordsPopup.sc";
import Modal from "../../../components/modal_shared/Modal";
import Main from "../../../components/modal_shared/Main.sc";
import Footer from "../../../components/modal_shared/Footer.sc";
import ButtonContainer from "../../../components/modal_shared/ButtonContainer.sc";
import { StyledButton } from "../../../components/allButtons.sc";

export default function ReviewWordsPopup({ open, handleCancel }) {
    if (!open) return null;

    return (
        <Modal open={open} onClose={handleCancel} wrapperBackgroundColor="#fff1d4" hideCloseButton>
            <s.ReviewWordsImage src="/static/images/ReviewWordsOnboarding.png" alt="Review words illustration" />
            <Main>
                <p style={{ textAlign: "center", fontWeight: "500" }}>
                    Tap <b>Review Words</b> to open your first Word List.
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