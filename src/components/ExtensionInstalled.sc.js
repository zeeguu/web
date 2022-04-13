import styled from "styled-components";
import { Link } from "react-router-dom";

const ExtensionInstalledWrapper = styled.div`
    position: absolute;
    top: 10%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
`
const PaddedLink = styled(Link)`
    padding: 1em;
`

export {ExtensionInstalledWrapper, PaddedLink}
