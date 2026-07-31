import styled from "styled-components";
import LoadingAnimation from "../../components/LoadingAnimation";

const Panel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 18rem;
  gap: 0.5rem;
  padding: 2rem;
  text-align: center;
  background-color: #fff8ef;
  border: 1px solid #ffcf99;
  border-radius: 8px;
`;

const Title = styled.p`
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0;
`;

// Shown in place of the editor while a level is being rewritten: the text is
// about to be swapped wholesale, so the editor is hidden (nothing worth editing)
// and this makes the work visible. Uses LoadingAnimation's lightweight inline
// mode (no network-probe / wait-game machinery).
export default function RewritingIndicator({ level }) {
  return (
    <Panel>
      <LoadingAnimation delay={0} showReportIssue={false}>
        <Title>Rewriting to {level}…</Title>
      </LoadingAnimation>
      <Subtitle>This can take a moment — the rewritten text will replace the editor here.</Subtitle>
    </Panel>
  );
}
