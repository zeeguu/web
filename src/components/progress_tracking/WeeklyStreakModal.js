import Modal from "../modal_shared/Modal.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import Main from "../modal_shared/Main.sc.js";
import * as s from "../../components/progress_tracking/ProgressTrackingModal.sc.js";
import NavIcon from "../../components/MainNav/NavIcon.js";
import {zeeguuOrange} from "../colors";
import ReactLink from "../ReactLink.sc.js";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function WeeklyStreakModal({open, setOpen, value}){
   
    return (
        <Modal
            open={open}
            onClose={()=>{
                setOpen(false);
            }}
        >
            <Header withoutLogo>
                <Heading>Current Weekly Streak</Heading>
            </Header>
            <Main>
            <s.IconAndIntegerRow>
                <NavIcon name="headerStreak" size={90} color={zeeguuOrange}/>
                <s.Value>{value}</s.Value>
                <h3>weeks</h3>
                </s.IconAndIntegerRow>
                
                <s.TextRow>You have practiced every week for {value} weeks straigth!</s.TextRow>
                 <ReactLink
                 className="small"
                 onClick={() => setOpen(false)}
                 to="user_dashboard"
                 >
               More details of your practice frequency <ArrowForwardRoundedIcon />
            </ReactLink>
            </Main>
        </Modal>

        
    );
}