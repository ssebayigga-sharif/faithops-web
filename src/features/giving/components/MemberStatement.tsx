import { useRef } from "react";
import { Button, Stack, TextInput, Tile } from "@carbon/react";
import { Download, Search } from "@carbon/icons-react";
import type { GivingRecord } from "@/features/giving/types";
import {
  formatUGX,
  formatShortDate,
  getCategoryLabel,
  buildCategoryTotals,
} from "../givingUtils";
import { colors } from "./givingStyles";

interface MemberStatementProps {
  memberName: string;
  onMemberNameChange: (name: string) => void;
  records: GivingRecord[];
  totalAmount: number;
}

export function MemberStatement({
  memberName,
  onMemberNameChange,
  records,
  totalAmount,
}: MemberStatementProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const isEmpty = !memberName.trim() || records.length === 0;

  return (
    <Stack gap={5}>
      <Stack gap={1}>
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 600,
            color: colors.text,
          }}
        >
          Member Statement
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: colors.textMuted,
          }}
        >
          Generate a giving statement for an individual member showing all their
          contributions with receipts.
        </p>
      </Stack>

      <Stack gap={4}>
        <TextInput
          id="member-statement-name"
          labelText="Member name"
          placeholder="Search member name..."
          value={memberName}
          onChange={(e) => onMemberNameChange(e.target.value)}
        />

        {!isEmpty && (
          <>
            <div ref={printRef}>
              <Tile
                style={{
                  background: colors.white,
                  border: `1px solid ${colors.border}`,
                }}
              >
                <Stack gap={4}>
                  {/* Header */}
                  <Stack gap={1}>
                    <h3
                      style={{
                        margin: 0,
                        fontSize: "16px",
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      Giving Statement
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: colors.textMuted,
                      }}
                    >
                      Kabulengwa Seventh-day Adventist Church
                    </p>
                    <p
                      style={{
                        margin: "4px 0 0",
                        fontSize: "14px",
                        fontWeight: 600,
                        color: colors.brand,
                      }}
                    >
                      Member: {memberName}
                    </p>
                  </Stack>

                  <hr
                    style={{
                      border: "none",
                      borderTop: `1px solid ${colors.border}`,
                    }}
                  />

                  {/* Category totals summary */}
                  <Stack gap={2}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      Contribution Summary
                    </h4>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "1rem",
                      }}
                    >
                      {buildCategoryTotals(records).map((cat) => (
                        <div key={cat.categoryId} style={{ flex: "1 1 120px" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              color: colors.textMuted,
                              textTransform: "uppercase",
                              letterSpacing: "0.06em",
                            }}
                          >
                            {cat.label}
                          </span>
                          <p
                            style={{
                              margin: "2px 0 0",
                              fontSize: "16px",
                              fontWeight: 700,
                              color: colors.text,
                            }}
                          >
                            {formatUGX(cat.amount)}
                          </p>
                        </div>
                      ))}
                      <div style={{ flex: "1 1 120px" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            color: colors.textMuted,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                          }}
                        >
                          Grand Total
                        </span>
                        <p
                          style={{
                            margin: "2px 0 0",
                            fontSize: "18px",
                            fontWeight: 700,
                            color: colors.brand,
                          }}
                        >
                          {formatUGX(totalAmount)}
                        </p>
                      </div>
                    </div>
                  </Stack>

                  <hr
                    style={{
                      border: "none",
                      borderTop: `1px solid ${colors.border}`,
                    }}
                  />

                  {/* Individual records */}
                  <Stack gap={2}>
                    <h4
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        fontWeight: 600,
                        color: colors.text,
                      }}
                    >
                      Giving History ({records.length} record
                      {records.length !== 1 ? "s" : ""})
                    </h4>
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "13px",
                      }}
                    >
                      <thead>
                        <tr
                          style={{ background: "var(--cds-layer-02, #f4f4f4)" }}
                        >
                          <th
                            style={{
                              textAlign: "left",
                              padding: "0.5rem",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            Date
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "0.5rem",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            Receipt
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "0.5rem",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            Categories
                          </th>
                          <th
                            style={{
                              textAlign: "right",
                              padding: "0.5rem",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            Amount
                          </th>
                          <th
                            style={{
                              textAlign: "left",
                              padding: "0.5rem",
                              borderBottom: `1px solid ${colors.border}`,
                            }}
                          >
                            Method
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((r) => (
                          <tr key={r.id}>
                            <td
                              style={{
                                padding: "0.5rem",
                                borderBottom: `1px solid ${colors.border}`,
                              }}
                            >
                              {formatShortDate(r.date)}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem",
                                borderBottom: `1px solid ${colors.border}`,
                              }}
                            >
                              {r.receiptNumber}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem",
                                borderBottom: `1px solid ${colors.border}`,
                              }}
                            >
                              {r.entries
                                .map((e) => getCategoryLabel(e.categoryId))
                                .join(", ")}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem",
                                borderBottom: `1px solid ${colors.border}`,
                                textAlign: "right",
                                fontWeight: 600,
                              }}
                            >
                              {formatUGX(r.totalAmount)}
                            </td>
                            <td
                              style={{
                                padding: "0.5rem",
                                borderBottom: `1px solid ${colors.border}`,
                              }}
                            >
                              {r.method.replace(/_/g, " ")}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr
                          style={{ background: "var(--cds-layer-02, #f4f4f4)" }}
                        >
                          <td
                            colSpan={3}
                            style={{
                              padding: "0.5rem",
                              fontWeight: 600,
                            }}
                          >
                            Total
                          </td>
                          <td
                            style={{
                              padding: "0.5rem",
                              textAlign: "right",
                              fontWeight: 600,
                            }}
                          >
                            {formatUGX(totalAmount)}
                          </td>
                          <td
                            style={{
                              padding: "0.5rem",
                            }}
                          />
                        </tr>
                      </tfoot>
                    </table>
                  </Stack>

                  {/* Scripture footer */}
                  <hr
                    style={{
                      border: "none",
                      borderTop: `1px solid ${colors.border}`,
                    }}
                  />
                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      fontStyle: "italic",
                      color: colors.textMuted,
                    }}
                  >
                    "Each of you should give what you have decided in your heart
                    to give, not reluctantly or under compulsion, for God loves
                    a cheerful giver." — 2 Corinthians 9:7
                  </p>
                </Stack>
              </Tile>
            </div>

            <div>
              <Button
                kind="secondary"
                renderIcon={Download}
                onClick={handlePrint}
              >
                Print Statement
              </Button>
            </div>
          </>
        )}

        {memberName.trim() && records.length === 0 && (
          <Tile
            style={{
              background: colors.white,
              border: `1px solid ${colors.border}`,
            }}
          >
            <p style={{ fontSize: "13px", color: colors.textMuted }}>
              No giving records found for "{memberName}".
            </p>
          </Tile>
        )}
      </Stack>
    </Stack>
  );
}
