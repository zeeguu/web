import {useState, useContext, useEffect} from "react";
import {UserContext} from "../contexts/UserContext";
import { StyledButton } from "../components/allButtons.sc";
import { CenteredColumn } from "./Congratulations.sc";


export default function ExercisesProgressSummary({onHandle}){
    const [username, setUsername] = useState();
    const {userDetails} = useContext(UserContext);

    useEffect(() =>{
        setUsername(userDetails.name);
    }, []);
    
    return (
        <>
        <CenteredColumn className="centeredColumn">
          <h1>
            Exercise complete!
          </h1>
        </CenteredColumn>
        <CenteredColumn>
        <p>You have made progress. Awesome, {username}!</p>
        </CenteredColumn>
        <CenteredColumn>
        <StyledButton primary onClick={onHandle}> 
                Continue
            </StyledButton>
        </CenteredColumn>           
        </>
    )
}