import styled from "styled-components";
import { zeeguuOrange } from "../components/colors";

export const BannerContainer = styled.div`
  margin-top: 30px;
  padding: 16px;
  background-color: var(--bg-secondary);
  border: 1px solid ${zeeguuOrange};
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
`;

export const BannerMessage = styled.div`
  color: var(--text-primary);
  font-size: 14px;
`;

export const BannerButton = styled.button`
  background-color: ${zeeguuOrange};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
`;
