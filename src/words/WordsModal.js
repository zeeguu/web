import Modal from "../components/modal_shared/Modal";
import Main from "../components/modal_shared/Main.sc";
import * as s from "../components/progress_tracking/ProgressTrackingModal.sc";
import Heading from "../components/modal_shared/Heading.sc.js";

export default function WordsModal({open, setOpen, value}){
    
    console.log("it's open")
    return (
        <Modal
            open={open}
            onClose={()=>{
                console.log("Closing modal");
                setOpen(false);
            }}
        >
            <Main>
                <s.IconAndIntegerRow>
                <Heading>You'll need to practice this word {value.cooling_interval === 0 ? "today" : `in ${value.cooling_interval} days`}  to get closer to level {value.level} </Heading>
                </s.IconAndIntegerRow>
            </Main>
        </Modal>

        
    );
}