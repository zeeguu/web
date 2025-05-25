import Modal from "../modal_shared/Modal.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import Main from "../modal_shared/Main.sc.js";
import * as s from "../../components/progress_tracking/ProgressTrackingModal.sc.js";

export default function WeeklyMinutesReadModal({open, setOpen, value}){
    return (
        <Modal
            open={open}
            onClose={()=>{
                setOpen(false);
            }}
        >
            <Header withoutLogo>
                <Heading>Your weekly minutes read</Heading>
            </Header>
            <Main>
                <s.TextRow>You have spent time reading in {value} articles this week!</s.TextRow>
            </Main>
        </Modal>

        
    );
}