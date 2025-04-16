import { css } from "@emotion/css";

export const style = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  & > div {
    &:first-child {
      background: var(--primary-gradient-color);
    }
  }

  form {
    & > div {
      margin-bottom: 0;
    }

    & > div {
      .MuiFormLabel-root.Mui-focused {
        color: var(--text-color);
      }

      .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: var(--text-color);
      }
    }

    & > a {
      color: #175aa7;
      text-decoration: none;
      display: inline-block;
      margin: 16px 0;

      &:hover {
        opacity: 0.8;
      }
    }

    & > button {
      color: white;
      background: var(--primary-gradient-color);
      text-transform: capitalize;
    }
  }
`;
