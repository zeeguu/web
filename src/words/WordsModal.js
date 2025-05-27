import Modal from "../components/modal_shared/Modal";
import Main from "../components/modal_shared/Main.sc";
import * as s from "../components/progress_tracking/ProgressTrackingModal.sc";

export default function WordsModal({open, setOpen, value}){
    
    return (
        <Modal
            open={open}
            onClose={()=>{
                setOpen(false);
            }}
        >
            <Main>
                <s.IconAndIntegerRow>
                <s.Value>{value}</s.Value>
                </s.IconAndIntegerRow>
                <s.TextRow>You need to practice </s.TextRow>
            </Main>
        </Modal>

        
    );
}