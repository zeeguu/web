import styled from "styled-components";

const CompactWord = styled.div`
  display: inline-block;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: 4px;
  padding: 4px 8px;
  margin: 8px 0.5em 0 0;
  font-size: 0.9em;
  line-height: 1.2;
`;

const WordContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
  
  .from {
    font-weight: 600;
  }
  
  .rank {
    font-weight: 300;
    font-size: 0.7em;
    color: var(--text-muted);
  }
  
  .separator {
    color: var(--text-secondary);
    font-weight: 300;
  }
  
  .to {
    font-weight: 300;
    color: #007bff;
  }
  
  .user-added {
    margin-left: 4px;
    font-size: 0.6em;
    background-color: var(--bg-tertiary);
    padding: 1px 3px;
    border-radius: 2px;
    color: var(--text-secondary);
  }
`;

export { CompactWord, WordContent };