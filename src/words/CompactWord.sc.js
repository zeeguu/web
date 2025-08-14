import styled from "styled-components";

const CompactWord = styled.div`
  display: inline-block;
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
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
    color: #888;
  }
  
  .separator {
    color: #666;
    font-weight: 300;
  }
  
  .to {
    font-weight: 300;
    color: #007bff;
  }
  
  .user-added {
    margin-left: 4px;
    font-size: 0.6em;
    background-color: #e3f2fd;
    padding: 1px 3px;
    border-radius: 2px;
    color: #1976d2;
  }
`;

export { CompactWord, WordContent };