import styled from 'styled-components';

export const ReactFlowWrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  min-height: 0;
  flex-wrap: nowrap;
  flex-grow: 1;

  svg {
    fill: ${({ theme }) => theme?.defaults?.iconColor};
  }

  .react-flow {
    background: ${({ theme }) => theme?.graph?.background};
  }

  .react-flow__controls-button {
    background: ${({ theme }) => theme?.graph?.nodes?.background};
    border-bottom: none;
  }

  .react-flow__node-taskNode,
  .react-flow__node-subNode {
    border-radius: ${({ theme }) => theme?.defaults?.borderRadius};
    font-size: 1rem;
    text-align: center;
    background-color: ${({ theme }) => theme?.graph?.nodes?.background};
    padding: 0.75rem 0.75rem 1rem;
    display: flex;
    align-items: center;

    .react-flow__handle {
      width: 0.675rem;
      height: 0.675rem;
      background-color: ${({ theme }) => theme?.graph?.handle?.background};
      border: none;
    }

    .react-flow__handle-left {
      left: -3px;
      transform: none;
      top: 0;
    }
    .react-flow__handle-right {
      right: -3px;
      transform: none;
      top: 0;
    }

    &.selectable {
      &:hover {
        box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.2);
      }
    }
    &.selected {
      outline: ${({ theme }) => theme?.input?.focusedOutline};
    }
  }

  .react-flow__node-startNode,
  .react-flow__node-endNode {
    &__wrapper {
      display: flex;
      align-items: center;
      padding: 0.5rem 2rem 0.5rem 1rem;
      transform: skew(-20deg);
      background: ${({ theme }) => theme?.graph?.nodes?.background};
      border-radius: ${({ theme }) => theme?.defaults?.borderRadius};
      p {
        display: flex;
        align-items: center;
        column-gap: 1rem;
      }
      p,
      .react-flow__handle {
        transform: skew(20deg) !important;
      }
      .react-flow__handle {
        top: calc(50% - 5px);
        width: 0.675rem;
        height: 0.675rem;
        background-color: ${({ theme }) => theme?.graph?.handle?.background};
        border: none;
      }
    }
    &.selectable {
      .react-flow__node-startNode__wrapper,
      .react-flow__node-endNode__wrapper {
        &:hover {
          box-shadow: 2px 2px 4px 1px rgb(0 0 0 / 20%);
        }
      }
    }

    &.selected {
      > div {
        background: ${({ theme }) => theme?.graph?.nodes?.hover?.background};
        box-shadow: 2px 2px 4px 1px rgb(0 0 0 / 20%);
        outline: ${({ theme }) => theme?.input?.focusedOutline};
      }
    }
  }

  .react-flow__node-mapNode,
  .react-flow__node-conditionalNode {
    display: flex;
    align-items: center;
    &--internal {
      background: ${({ theme }) => theme?.graph?.nodes?.background};
      padding: 1rem 2rem 1rem;
      border-radius: ${({ theme }) => theme?.defaults?.borderRadius};
    }

    .react-flow__handle {
      width: 0.675rem;
      height: 0.675rem;
      background-color: ${({ theme }) => theme?.graph?.handle?.background};
      border: none;
    }

    .react-flow__handle-left {
      left: 0.4rem;
      transform: none;
      top: 0;
    }
    .react-flow__handle-right {
      right: 0.4rem;
      transform: none;
      top: 0;
    }

    &.selectable {
      &:hover {
        box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.2);
      }
    }
    &.selected {
      .react-flow__node-mapNode--internal {
        outline: ${({ theme }) => theme?.input?.focusedOutline};
      }
    }
  }
`;
