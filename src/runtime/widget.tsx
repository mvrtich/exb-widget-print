/** @jsx jsx */
import {
  AllWidgetProps,
  BaseWidget,
  jsx,
  React,
  ImmutableArray,
} from "jimu-core";
import { WidgetPlaceholder } from "jimu-ui";
import { JimuMapViewComponent, JimuMapView } from "jimu-arcgis";

import Print from "esri/widgets/Print";

import { IMConfig } from "../config";
import defaultMessages from "./translations/default";
import { getStyle } from "./style";

const widgetIcon = require("./assets/icon.svg");

export interface WidgetProps extends AllWidgetProps<IMConfig> {}
export interface WidgetState {
  hasMapWidget: boolean;
}

export default class Widget extends BaseWidget<WidgetProps, WidgetState> {
  private view: __esri.MapView | __esri.SceneView;
  private printWidget: __esri.Print;
  private container: React.RefObject<HTMLDivElement>;

  constructor(props: WidgetProps) {
    super(props);

    this.container = React.createRef<HTMLDivElement>();

    this.handleActiveViewChange = this.handleActiveViewChange.bind(this);
    this.handleUseMapWidgetIdsPropChange = this.handleUseMapWidgetIdsPropChange.bind(
      this
    );
    this.handlePrintServiceUrlPropChange = this.handlePrintServiceUrlPropChange.bind(
      this
    );

    this.state = {
      hasMapWidget: props.useMapWidgetIds && props.useMapWidgetIds.length > 0,
    };
  }

  componentDidMount(): void {
    this.createPrintWidget();
  }

  componentWillUnmount(): void {
    this.destroyPrintWidget();
    this.view = null;
  }

  componentDidUpdate(prevProps: WidgetProps, prevState: WidgetState): void {
    if (this.props.useMapWidgetIds !== prevProps.useMapWidgetIds) {
      this.handleUseMapWidgetIdsPropChange(
        this.props.useMapWidgetIds,
        prevProps.useMapWidgetIds
      );
    }

    if (
      this.props.config.printServiceUrl !== prevProps.config.printServiceUrl
    ) {
      this.handlePrintServiceUrlPropChange(
        this.props.config.printServiceUrl,
        prevProps.config.printServiceUrl
      );
    }
  }

  render() {
    const { theme, intl, useMapWidgetIds, id } = this.props;
    const { hasMapWidget } = this.state;

    if (!hasMapWidget) {
      return (
        <div className="jimu-widget" css={getStyle(theme)}>
          <div className="exb-widget-print">
            <WidgetPlaceholder
              icon={widgetIcon}
              autoFlip
              theme={theme}
              message={intl.formatMessage({
                id: "selectMapWidget",
                defaultMessage: defaultMessages.selectMapWidget,
              })}
              widgetId={id}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="jimu-widget" css={getStyle(theme)}>
        <div className="exb-widget-print" ref={this.container}></div>
        {/* utility component (no rendered output) */}
        <JimuMapViewComponent
          useMapWidgetIds={useMapWidgetIds}
          onActiveViewChange={this.handleActiveViewChange}
        />
      </div>
    );
  }

  createPrintWidget(): void {
    const printServiceUrl =
      this.props.config.printServiceUrl ||
      this.props.portalSelf?.helperServices?.printTask?.url;

    this.destroyPrintWidget();

    if (
      !Boolean(printServiceUrl) ||
      printServiceUrl.length === 0 ||
      !Boolean(this.view) ||
      !Boolean(this.container.current)
    ) {
      return;
    }

    const container = document.createElement("div");
    container.className = "h-100 w-100";
    this.container.current.appendChild(container);

    this.printWidget = new Print({
      container,
      view: this.view,
      printServiceUrl: printServiceUrl,
    });
  }

  destroyPrintWidget(): void {
    Boolean(this.printWidget) &&
      !this.printWidget.destroyed &&
      this.printWidget.destroy();
    this.printWidget = null;
  }

  handleUseMapWidgetIdsPropChange(
    useMapWidgetIds: ImmutableArray<string>,
    prevUseMapWidgetIds: ImmutableArray<string>
  ): void {
    this.destroyPrintWidget();
    this.view = null;

    this.setState({
      hasMapWidget: useMapWidgetIds && useMapWidgetIds.length > 0,
    });
  }

  handlePrintServiceUrlPropChange(
    printServiceUrl: string,
    prevPrintServiceUrl: string
  ): void {
    this.createPrintWidget();
  }

  handleActiveViewChange(
    activeView: JimuMapView,
    previousActiveViewId: string
  ): void {
    this.destroyPrintWidget();
    this.view = null;

    if (!Boolean(activeView) || !Boolean(activeView.view)) {
      return;
    }

    this.view = activeView.view;
    this.createPrintWidget();
  }
}
