import ReactEChartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts/core";
import {
  LineChart,
  BarChart,
  GaugeChart,
  PieChart,
  ScatterChart,
} from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import { useThemeStore } from "@/lib/stores/theme-store";
import { getEChartsTheme } from "@/theme/tokens";

echarts.use([
  LineChart,
  BarChart,
  GaugeChart,
  PieChart,
  ScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  CanvasRenderer,
]);

interface EChartWrapperProps {
  option: Record<string, unknown>;
  height?: string;
  className?: string;
}

export function EChartWrapper({
  option,
  height = "300px",
  className,
}: EChartWrapperProps) {
  const isDark = useThemeStore((s) => s.isDark);
  const theme = getEChartsTheme(isDark);

  const mergedOption = {
    ...theme,
    ...option,
    textStyle: { ...theme.textStyle, ...(option.textStyle as Record<string, unknown> || {}) },
  };

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={mergedOption}
      style={{ height }}
      className={className}
      notMerge
      lazyUpdate
    />
  );
}
