import styled from "styled-components";
import { white } from "../components/colors";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  height: 100vh;
  background-color: ${white};
`;

export const Header = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 2rem;
`;

// not used anymore
// export const PlaceholderCard = styled.div`
//   background: white;
//   border-radius: 12px;
//   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
//   padding: 3rem;
//   max-width: 600px;
//   width: 100%;
//   text-align: center;
// `;

// export const Title = styled.h1`
//   color: #333;
//   margin-bottom: 1rem;
//   font-size: 2rem;
// `;

// export const Description = styled.p`
//   color: #666;
//   font-size: 1.1rem;
//   line-height: 1.6;
// `;

// export const ComingSoon = styled.div`
//   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
//   color: white;
//   padding: 0.5rem 1.5rem;
//   border-radius: 20px;
//   display: inline-block;
//   margin-top: 2rem;
//   font-weight: 600;
// `;
