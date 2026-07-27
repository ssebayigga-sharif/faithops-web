import { StepNumber } from "./givingUi";
import { colors } from "./givingStyles";

const STEPS = ["Entry", "Review", "Receipt"] as const;

const STEP_MAP: Record<string, number> = {
  entry: 0,
  review: 1,
  receipt: 2,
};

export function StepIndicator({ current }: { current: string }) {
  const currentIndex = STEP_MAP[current] ?? 0;
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.5rem 0",
        overflowX: "auto",
      }}
      aria-label="Progress steps"
    >
      {STEPS.map((step, i) => (
        <div
          key={step}
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          <StepNumber index={i} currentIndex={currentIndex} />
          <span
            style={{
              fontSize: "13px",
              fontWeight: i === currentIndex ? 600 : 400,
              color: i === currentIndex ? colors.text : colors.textMuted,
            }}
          >
            {step}
          </span>
          {i < STEPS.length - 1 && (
            <span
              aria-hidden
              style={{
                width: "2rem",
                height: 1,
                background: colors.border,
                margin: "0 0.25rem",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
