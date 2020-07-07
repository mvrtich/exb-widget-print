import { ThemeVariables, css, SerializedStyles } from "jimu-core";

export function getStyle(theme?: ThemeVariables): SerializedStyles {
  return css`
    overflow: auto;
    .exb-widget-print {
      width: 100%;
      height: 100%;

      label {
        display: block;
      }

      .esri-print__export-button {
        background-color: ${theme.colors.primary};
        border: 1px solid ${theme.colors.primary};
      }
    }
  `;
}
