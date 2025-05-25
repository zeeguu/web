import Modal from "../modal_shared/Modal.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import Main from "../modal_shared/Main.sc.js";
import * as s from "../../components/progress_tracking/ProgressTrackingModal.sc.js";
import NavIcon from "../../components/MainNav/NavIcon.js";
import {zeeguuOrange} from "../colors";
import ReactLink from "../ReactLink.sc.js";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";



export default function WeeklyWordsPracticedModal({open, setOpen, value}){
    
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
                <s.IconAndIntegerRow>
                <NavIcon name="words" size={70} color={zeeguuOrange}/>
                <s.Value>{value}</s.Value>
                </s.IconAndIntegerRow>
                <s.TextRow>You have practiced {value} new words this week!</s.TextRow>
                 <ReactLink
                 className="small"
                 onClick={() => setOpen(false)}
                 to="/words"
                 >
               See all your practiced words <ArrowForwardRoundedIcon />
            </ReactLink>
            </Main>
        </Modal>

        
    );
}