import { describe, it, expect } from "vitest";
import {
  buildLabelMatcher,
  rateQuery,
  sumRateQuery,
  errorRatioQuery,
  summaryAvgQuery,
  availabilitySLI,
  burnRateQuery,
} from "../utils/promql-templates.js";

describe("PromQL Templates", () => {
  describe("buildLabelMatcher", () => {
    it("should return empty string for empty filters", () => {
      expect(buildLabelMatcher({})).toBe("");
    });

    it("should build single label matcher with braces", () => {
      expect(buildLabelMatcher({ cluster: "prod" })).toBe('{cluster="prod"}');
    });

    it("should build multiple label matchers", () => {
      const result = buildLabelMatcher({ cluster: "prod", region: "us-east" });
      expect(result).toBe('{cluster="prod", region="us-east"}');
    });

    it("should skip undefined/empty values", () => {
      const result = buildLabelMatcher({
        cluster: "prod",
        region: undefined,
        service: "",
      });
      expect(result).toBe('{cluster="prod"}');
    });
  });

  describe("rateQuery", () => {
    it("should build a rate query", () => {
      const result = rateQuery("cha_core_rating_akka_requests_total", "5m");
      expect(result).toBe(
        "rate(cha_core_rating_akka_requests_total[5m])"
      );
    });

    it("should include filters when provided", () => {
      const result = rateQuery(
        "cha_core_rating_akka_requests_total",
        "5m",
        '{cluster="prod"}'
      );
      expect(result).toBe(
        'rate(cha_core_rating_akka_requests_total{cluster="prod"}[5m])'
      );
    });
  });

  describe("sumRateQuery", () => {
    it("should build a sum rate query", () => {
      const result = sumRateQuery("cha_core_rating_akka_requests_total", "5m");
      expect(result).toBe(
        "sum(rate(cha_core_rating_akka_requests_total[5m]))"
      );
    });

    it("should include group-by labels", () => {
      const result = sumRateQuery(
        "cha_core_rating_akka_requests_total",
        "5m",
        "",
        ["operation"]
      );
      expect(result).toBe(
        "sum by (operation)(rate(cha_core_rating_akka_requests_total[5m]))"
      );
    });
  });

  describe("errorRatioQuery", () => {
    it("should build an error ratio query", () => {
      const result = errorRatioQuery(
        "cha_core_rating_akka_requests_errors_total",
        "cha_core_rating_akka_requests_total",
        "5m"
      );
      expect(result).toBe(
        "sum(rate(cha_core_rating_akka_requests_errors_total[5m])) / sum(rate(cha_core_rating_akka_requests_total[5m]))"
      );
    });
  });

  describe("summaryAvgQuery", () => {
    it("should build a summary average query", () => {
      const result = summaryAvgQuery(
        "cha_core_rating_akka_request_duration_seconds",
        "5m"
      );
      expect(result).toBe(
        "rate(cha_core_rating_akka_request_duration_seconds_sum[5m]) / rate(cha_core_rating_akka_request_duration_seconds_count[5m])"
      );
    });
  });

  describe("availabilitySLI", () => {
    it("should build an availability SLI query", () => {
      const result = availabilitySLI(
        "cha_core_rating_akka_requests_errors_total",
        "cha_core_rating_akka_requests_total",
        "1h"
      );
      expect(result).toBe(
        "1 - (sum(rate(cha_core_rating_akka_requests_errors_total[1h])) / sum(rate(cha_core_rating_akka_requests_total[1h])))"
      );
    });
  });

  describe("burnRateQuery", () => {
    it("should build a burn rate query with error budget", () => {
      // sloTarget=0.999 → errorBudget = 1 - 0.999 = 0.001
      const result = burnRateQuery(
        "cha_core_rating_akka_requests_errors_total",
        "cha_core_rating_akka_requests_total",
        0.999,
        "1h"
      );
      expect(result).toContain(
        "sum(rate(cha_core_rating_akka_requests_errors_total[1h]))"
      );
      expect(result).toContain("/ 0.001");
    });
  });
});
