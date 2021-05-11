import styled from "styled-components";

export const ReadingInsightHeader = styled.div`
.reading-insight-wrapper{
    display: flex;
    flex-direction: row;
    margin-top:3vh;
    height: 7.5vh;
}

.title{
    margin-left: 2vw;
    width: 51%;
    min-width: 180px; 
}

.circle-wrapper{
    display: flex;
    width: 30em;
    padding-left: 10%;
    justify-content: center;
}

.circle{
    width:5em;
    text-align: center;
}

#text-level{
    width:4em;
    margin-right: 2em;
}

#text-length{
    margin-right:1.5em;
}

#reading-time{
    margin-right:1.9em;
}

#translated-words{
    margin-right:4.3em;
}
`;