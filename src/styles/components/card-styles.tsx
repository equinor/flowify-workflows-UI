import styled from 'styled-components';

export const ComponentCard = styled.div`
  padding: 1.5rem;
  border: 1px solid ${(props) => props.theme.colors.backgrounds.light};
  display: flex;
  row-gap: 1rem;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background: #ade2e619;
  border-radius: 1rem;
`;

export const Paper = styled.div<{ padded?: boolean }>`
  box-shadow: ${(props) => props.theme.shadows.elevated};
  border-top: 1px solid ${(props) => props.theme.colors.backgrounds.light};
  border-radius: 1rem;
  background: white;
  padding: ${(props) => (props.padded ? '2rem' : '0')};
`;

interface IStyledCard {
  isLink?: boolean;
}

export const WorkspaceCard = styled.div<IStyledCard>`
  box-shadow: ${(props) => props.theme.shadows.elevated};
  cursor: ${(props) => (props.isLink ? 'pointer' : 'inherit')};
  padding: 2rem 1rem 2rem 2rem;
  border-top: 1px solid ${(props) => props.theme.colors.backgrounds.light};
  border-radius: 1rem;
  &:hover {
    background-color: ${(props) => (props.isLink ? props.theme.colors.backgrounds.light : 'white')};
  }
`;
