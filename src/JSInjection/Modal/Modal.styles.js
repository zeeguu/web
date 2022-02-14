import styled from 'styled-components';
import ReactModal from 'react-modal';

export const StyledModal = styled(ReactModal)`

h1{
    font-size: 1.9em !important;
}

h2{
    font-size: 1.7rem !important;
}

h3{
    font-size: 1.5rem !important;
}

h4, h5, h6{
    font-size: 1.4rem !important;
}

p{
    font-size: 1.1rem!important;
}



font-family: Arial, sans-serif;
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
z-index: 2000;
margin: 40px auto;
background-color: white;
padding:2%;
height:80%;
width: 70%;
overflow-y: auto;
box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);

::-webkit-scrollbar {
    width: 8px;
}

::-webkit-scrollbar-track{
    box-shadow: inset 0 0 6px rgba(255,208,71);
}
 
::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgb(255, 209, 71);
}
`;

export const StyledButton = styled.button`
position: sticky;
top: 0px;
left: 100%;
border-radius: 10%;
width: 30px;
height: 25px !important;
display: block;
cursor: pointer;
background-color: rgba(255,208,71);
`



//font-size: 20px;
//height:90%;
//width: 70%;
//border: none;
//background-color:white;
//position: fixed;
//box-shadow: 0px 12px 48px rgba(29, 5, 64, 0.32);
//  top: 0;
//  right: 0;
//  bottom: 0;
//  left: 0;
//  overflow-y: auto;