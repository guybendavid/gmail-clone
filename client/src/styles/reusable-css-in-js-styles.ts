import { css } from "@emotion/css";

export const overflowHandler = (maxWidth: string = "unset") => css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${maxWidth};
`;

export const scrollbarStyle = css`
  &::-webkit-scrollbar {
    opacity: 0;
    width: 12px;

    @media only screen and (max-width: 765px) {
      width: 6px;
    }
  }

  &:hover {
    &::-webkit-scrollbar {
      opacity: 1;
    }

    &::-webkit-scrollbar-thumb {
      background: lightgray;
    }
  }
`;

export const primaryBoxShadowStyle = css`
  box-shadow:
    0 8px 10px 1px rgba(0, 0, 0, 0.14),
    0 3px 14px 2px rgba(0, 0, 0, 0.12),
    0 5px 5px -3px rgba(0, 0, 0, 0.2);
`;

export const blueButtonStyle = css`
  color: white;
  text-transform: capitalize;
  background: #3f51b5 !important;
`;
