import Modal from "../modal_shared/Modal.js";
import Header from "../modal_shared/Header.sc.js";
import Heading from "../modal_shared/Heading.sc.js";
import * as s from "./ProgressTrackingModal.sc.js";
import NavIcon from "../MainNav/NavIcon.js";
import {zeeguuOrange} from "../colors.js";
import ReactLink from "../ReactLink.sc.js";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

export default function ProgressModal({
    open,
    setOpen,
    value,
    title,
    descriptionStart,
    descriptionEnd,
    iconName,
    unit,
    linkText,
    linkTo,
    size,
}){
   
    return (
        <Modal
            open={open}
            onClose={()=>{
                setOpen(false);
            }}
        >
            <Header withoutLogo>
                <Heading>{title}</Heading>
            </Header>
            <s.ModalContent>
            <s.IconAndIntegerRow>
                <NavIcon name={iconName} size={size} color={zeeguuOrange}/>
                <s.Value>{value}</s.Value>
                <h3>{unit}</h3>
                </s.IconAndIntegerRow>
                <s.TextRow>{descriptionStart} {value} {descriptionEnd}</s.TextRow>
                 <ReactLink
                 className="small"
                 onClick={() => setOpen(false)}
                 to={linkTo}
                 >
               {linkText} <ArrowForwardRoundedIcon />
            </ReactLink>
            </s.ModalContent>
        </Modal>

        
    );
}