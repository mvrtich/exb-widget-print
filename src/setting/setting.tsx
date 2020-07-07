/** @jsx jsx */
import { BaseWidgetSetting, AllWidgetSettingProps } from "jimu-for-builder";
import { jsx } from "jimu-core";
import {
  SettingSection,
  SettingRow,
  JimuMapViewSelector,
} from "jimu-ui/setting-components";
import { TextInput } from "jimu-ui";

import { IMConfig } from "../config";
import defaultMessages from "./translations/default";
import { getStyle } from "./style";

export interface SettingProps extends AllWidgetSettingProps<IMConfig> {}
export interface SettingState {
  hasMapWidget: boolean;
}

export default class Setting extends BaseWidgetSetting<
  SettingProps,
  SettingState
> {
  constructor(props: SettingProps) {
    super(props);

    this.state = {
      hasMapWidget:
        Boolean(props.useMapWidgetIds) && props.useMapWidgetIds.length > 0,
    };

    this.handleMapWidgetChange = this.handleMapWidgetChange.bind(this);
    this.handlePrintServiceUrlChange = this.handlePrintServiceUrlChange.bind(
      this
    );
  }

  componentDidMount(): void {}

  componentWillUnmount(): void {}

  componentDidUpdate(prevProps: SettingProps, prevState: SettingState): void {}

  render() {
    const { intl, theme, useMapWidgetIds, config } = this.props;

    return (
      <div
        css={getStyle(theme)}
        className="jimu-widget-setting exb-widget-print"
      >
        <SettingSection
          title={intl.formatMessage({
            id: "mapWidget",
            defaultMessage: defaultMessages.mapWidget,
          })}
        >
          <SettingRow>
            <JimuMapViewSelector
              useMapWidgetIds={useMapWidgetIds}
              onSelect={this.handleMapWidgetChange}
            />
          </SettingRow>
        </SettingSection>
        <SettingSection
          title={intl.formatMessage({
            id: "options",
            defaultMessage: defaultMessages.options,
          })}
        >
          <SettingRow
            flow="wrap"
            label={intl.formatMessage({
              id: "printServiceUrl",
              defaultMessage: defaultMessages.printServiceUrl,
            })}
          >
            <TextInput
              className="w-100"
              placeholder={
                this.props.portalSelf?.helperServices?.printTask?.url
              }
              value={config.printServiceUrl}
              onAcceptValue={this.handlePrintServiceUrlChange}
            />
          </SettingRow>
        </SettingSection>
      </div>
    );
  }

  handleMapWidgetChange(useMapWidgetIds: string[]): void {
    this.setState({
      hasMapWidget: Boolean(useMapWidgetIds) && useMapWidgetIds.length > 0,
    });

    this.props.onSettingChange({
      id: this.props.id,
      useMapWidgetIds,
    });
  }

  handlePrintServiceUrlChange(value: string): void {
    this.props.onSettingChange({
      id: this.props.id,
      config: this.props.config.set("printServiceUrl", value),
    });
  }
}
