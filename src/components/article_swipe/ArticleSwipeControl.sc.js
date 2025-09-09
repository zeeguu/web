import styled, { css } from "styled-components";
import { white, veryLightGrey, zeeguuOrange, orange600, orange300 } from "../colors";

export const Bar = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4.5rem;
    padding: 1.75rem 1rem 0.25rem;
`;

export const BaseButton = styled.button`
    appearance: none;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: transform 120ms ease;
    will-change: transform;

    &:hover {
        filter: brightness(0.95);
    }

    &:active {
        transform: translateY(1px) scale(0.95);
    }
`;

export const DismissButton = styled(BaseButton)`
    width: 74px;
    height: 74px;
    background: ${white};
    box-shadow:
        0 22px 34px rgba(0, 0, 0, 0.12),
        0 6px 12px rgba(0, 0, 0, 0.06),
        0 0 0 3px ${veryLightGrey} inset;
`;

export const OpenButton = styled(BaseButton)`
    width: 112px;
    height: 112px;
    background: ${orange600};
    box-shadow:
        0 38px 60px rgba(0, 0, 0, 0.12),
        0 10px 20px rgba(0, 0, 0, 0.06); 
`;

export const SaveButton = styled(BaseButton)`
    width: 74px;
    height: 74px;
    background: ${white};
    box-shadow:
        0 22px 34px rgba(0, 0, 0, 0.12),
        0 6px 12px rgba(0, 0, 0, 0.06),
        0 0 0 3px ${orange300} inset;
`;

export const ButtonInner = styled.div`
    width: 100%;
    height: 100%;
    border-radius: inherit;
    display: grid;
    place-items: center;
`;
