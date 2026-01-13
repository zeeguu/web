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

const Message = styled.p`
  max-width: 400px;
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
`;

export default function EmptyState({ message, fillHeight = true }) {
  return (
    <Container $fillHeight={fillHeight}>
      <Message>{message}</Message>
    </Container>
  );
}
