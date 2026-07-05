import { Check } from "lucide-react";
import { Fragment } from "react";
import "./ReviewHistory.scss";

type ReviewStepStatus = "completed" | "active" | "pending";

const REVIEW_STEPS: { label: string; status: ReviewStepStatus }[] = [
  { label: "Draft Created", status: "completed" },
  { label: "Under Review", status: "completed" },
  { label: "Reviewer Approval", status: "active" },
  { label: "Manager Approval", status: "pending" },
  { label: "Audit Closed", status: "pending" },
];

const GRID_COLUMNS = REVIEW_STEPS.flatMap((_, index) =>
  index < REVIEW_STEPS.length - 1 ? ["auto", "1fr"] : ["auto"],
).join(" ");

const ReviewHistory = () => {
  return (
    <div
      className="review-history mt-2"
      aria-label="Review progress"
      role="list"
    >
      <div
        className="review-history__row review-history__row--labels"
        style={{ gridTemplateColumns: GRID_COLUMNS }}
      >
        {REVIEW_STEPS.map((step, index) => (
          <span
            key={step.label}
            className="review-history__label"
            style={{ gridColumn: index * 2 + 1 }}
          >
            {step.label}
          </span>
        ))}
      </div>

      <div
        className="review-history__row review-history__row--track"
        style={{ gridTemplateColumns: GRID_COLUMNS }}
      >
        {REVIEW_STEPS.map((step, index) => (
          <Fragment key={step.label}>
            <span
              role="listitem"
              className={`review-history__icon review-history__icon--${step.status}`}
              style={{ gridColumn: index * 2 + 1 }}
            >
              {step.status === "completed" && (
                <Check aria-hidden strokeWidth={3} />
              )}
              {step.status === "active" && (
                <span className="review-history__dot" aria-hidden />
              )}
            </span>
            {index < REVIEW_STEPS.length - 1 && (
              <span
                aria-hidden
                className={`review-history__connector${
                  step.status === "completed"
                    ? " review-history__connector--completed"
                    : ""
                }`}
                style={{ gridColumn: index * 2 + 2 }}
              />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ReviewHistory;
