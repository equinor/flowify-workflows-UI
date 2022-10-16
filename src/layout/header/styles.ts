import styled from 'styled-components';

export const TopBar = styled.div`
  padding: 0.25rem 2rem;
  background: ${({ theme }) => theme?.layout?.background};
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    color: ${({ theme }) => theme?.defaults?.color};
  }
`;

export const IconsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  .ff-header__link {
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      background-color: ${(props) => props.theme?.button?.background?.icon};
      border-radius: 50%;
    }
  }
`;
