import styled from "styled-components";

const SearchTopBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5em 1em 0.25em;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;
const HeadlineSearch = styled.h2`
  color: var(--text-primary);
  margin: 0 1.4em 0 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

const ContainerTitleSubscribe = styled.div`
  display: block;
`;

const ContainerH1Subscribe = styled.div`
  display: flex;
`;

const RowHeadlineSearch = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: baseline;
`;

const SearchNote = styled.p`
  color: #666;
  font-size: 0.9em;
  margin: 0.5em 0 1em 0;
`;

export { SearchTopBar, ContainerTitleSubscribe, HeadlineSearch, RowHeadlineSearch, ContainerH1Subscribe, SearchNote };
