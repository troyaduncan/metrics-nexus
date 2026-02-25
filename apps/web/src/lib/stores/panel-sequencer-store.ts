import { create } from "zustand";

/**
 * Sequential panel loader.
 *
 * Panels register a numeric index (their position in the grid).
 * Only the panel at `activeIndex` is allowed to fire Prometheus queries.
 * When that panel's query settles (data or error), it calls `advance()` to
 * allow the next panel to start.  This serialises Prometheus traffic so the
 * server only sees one panel's worth of queries at a time.
 */
interface PanelSequencerState {
  /** Index of the panel currently allowed to load. */
  activeIndex: number;
  /** Called by a panel when its queries have settled. */
  advance: () => void;
  /**
   * Reset back to panel 0 — call this whenever the dashboard tab
   * changes so all panels reload in order on the new tab.
   */
  reset: () => void;
}

export const usePanelSequencerStore = create<PanelSequencerState>((set) => ({
  activeIndex: 0,
  advance: () => set((s) => ({ activeIndex: s.activeIndex + 1 })),
  reset: () => set({ activeIndex: 0 }),
}));

/**
 * Hook for a single panel.  Returns whether this panel may fire queries and a
 * stable callback to signal completion.
 *
 * @param panelIndex  Zero-based position of this panel in the dashboard grid.
 */
export function usePanelSlot(panelIndex: number) {
  const activeIndex = usePanelSequencerStore((s) => s.activeIndex);
  const advance = usePanelSequencerStore((s) => s.advance);
  return {
    canLoad: activeIndex >= panelIndex,
    advance,
  };
}
