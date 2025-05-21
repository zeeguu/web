import { useEffect } from "react";
import Modal from "../modal_shared/Modal.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import Main from "../modal_shared/Main.sc.js";

export default function WeeklyWordsPracticedModal({open, setOpen}){
    useEffect(() => {
        if (open){
            //fetch correct data here
        }
    });
    return (
        <Modal
            open={open}
            onClose={()=>{
                setOpen(false);
            }}
        >
            <Header withoutLogo>
                <Heading>Your weekly words practiced</Heading>
            </Header>
            <Main>
            </Main>
        </Modal>

        
    );
}