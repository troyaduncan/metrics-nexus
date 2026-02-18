export const CHART_COLORS = {
  magenta: "#E20074",
  magentaLight: "#ff5ca3",
  magentaDark: "#a30053",
  blue: "#339af0",
  green: "#51cf66",
  orange: "#ff922b",
  red: "#ff6b6b",
  yellow: "#fcc419",
  purple: "#845ef7",
  teal: "#20c997",
  gray: "#868e96",
} as const;

export const CHART_SERIES_COLORS = [
  CHART_COLORS.magenta,
  CHART_COLORS.blue,
  CHART_COLORS.green,
  CHART_COLORS.orange,
  CHART_COLORS.purple,
  CHART_COLORS.teal,
  CHART_COLORS.yellow,
  CHART_COLORS.red,
];

export const SEVERITY_COLORS = {
  critical: CHART_COLORS.red,
  warning: CHART_COLORS.orange,
  info: CHART_COLORS.blue,
  ok: CHART_COLORS.green,
} as const;

export function getEChartsTheme(isDark: boolean) {
  return {
    backgroundColor: "transparent",
    textStyle: {
      color: isDark ? "#f1f3f5" : "#212529",
    },
    title: {
      textStyle: { color: isDark ? "#f1f3f5" : "#212529" },
    },
    legend: {
      textStyle: { color: isDark ? "#adb5bd" : "#495057" },
    },
    categoryAxis: {
      axisLine: { lineStyle: { color: isDark ? "#333" : "#dee2e6" } },
      axisLabel: { color: isDark ? "#adb5bd" : "#495057" },
      splitLine: { lineStyle: { color: isDark ? "#242424" : "#f1f3f5" } },
    },
    valueAxis: {
      axisLine: { lineStyle: { color: isDark ? "#333" : "#dee2e6" } },
      axisLabel: { color: isDark ? "#adb5bd" : "#495057" },
      splitLine: { lineStyle: { color: isDark ? "#242424" : "#f1f3f5" } },
    },
    color: CHART_SERIES_COLORS,
  };
}
