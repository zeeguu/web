import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  min-height: ${({ $fillHeight }) => ($fillHeight ? "calc(100vh - 10rem)" : "300px")};

  @media (max-width: 576px) {
    min-height: ${({ $fillHeight }) => ($fillHeight ? "calc(100vh - 12rem)" : "250px")};
  }
`;

const Title = styled.h2`
  margin: 0 0 0.4rem;
  font-size: 1.15rem;
`;

const Message = styled.p`
  max-width: 400px;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

// `title` and `children` are optional: most callers just want a sentence, but
// a screen that has something for the reader to *do* about the emptiness puts
// its controls in as children rather than building a second centred layout.
export default function EmptyState({ title, message, fillHeight = true, children }) {
  return (
    <Container $fillHeight={fillHeight}>
      {title && <Title>{title}</Title>}
      <Message>{message}</Message>
      {children}
    </Container>
  );
}
