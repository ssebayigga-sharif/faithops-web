import { useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Column,
  Grid,
  Select,
  SelectItem,
  Stack,
  TextInput,
  Toggle,
  InlineNotification,
  Tile,
} from "@carbon/react";
import {
  Save,
  Settings,
  Workspace,
  ColorPalette,
  Help,
} from "@carbon/icons-react";
import { useAppTheme, CarbonTheme } from "@/shared/hooks/useTheme";

export default function SettingsPage() {
  const { theme, setTheme, isDarkMode, toggleDarkMode } = useAppTheme();

  // Mock workspace state
  const [workspaceName, setWorkspaceName] = useState("Kabulengwa SDA Church");
  const [language, setLanguage] = useState("en");
  const [timezone, setTimezone] = useState("EAT");
  const [showNotification, setShowNotification] = useState(false);

  const handleSave = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value as CarbonTheme);
  };

  return (
    <Stack className="admin-page settings-page" gap={5}>
      <Stack className="admin-page__inner" gap={5}>
        {/* ── Page Header ── */}
        <Stack as="header" className="admin-page__header" gap={2}>
          <Breadcrumb noTrailingSlash>
            <BreadcrumbItem isCurrentPage>Settings</BreadcrumbItem>
          </Breadcrumb>
          <Stack
            orientation="horizontal"
            gap={5}
            style={{
              justifyContent: "space-between",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <Stack gap={1}>
              <h1
                className="admin-page__title"
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Settings size={24} /> Workspace Settings
              </h1>
              <p className="admin-page__subtitle">
                Configure your FaithOps workspace preferences, localization
                settings, and visual themes.
              </p>
            </Stack>
            <Button
              kind="primary"
              renderIcon={Save}
              size="md"
              onClick={handleSave}
              style={{ alignSelf: "flex-end" }}
            >
              Save Settings
            </Button>
          </Stack>
        </Stack>

        {/* ── Notification banner ── */}
        {showNotification && (
          <InlineNotification
            kind="success"
            title="Settings Saved Successfully"
            subtitle="Your workspace preferences and theme options have been synced."
            lowContrast
            onCloseButtonClick={() => setShowNotification(false)}
          />
        )}

        <Grid fullWidth withRowGap>
          {/* ── Visual Theme Section ── */}
          <Column sm={4} md={8} lg={8}>
            <Tile className="dashboard-section" style={{ height: "100%" }}>
              <Stack gap={5}>
                <Stack
                  className="dashboard-section__header"
                  gap={2}
                  style={{ padding: "0 0 1rem 0" }}
                >
                  <h2
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <ColorPalette size={20} /> Built-in Carbon Theming
                  </h2>
                  <p>
                    Customize the look and feel of the FaithOps dashboard using
                    official IBM Carbon themes.
                  </p>
                </Stack>

                <Stack
                  gap={5}
                  className="dashboard-section__body"
                  style={{ padding: 0 }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: "1rem",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          display: "block",
                          color: "var(--cds-text-primary)",
                        }}
                      >
                        Dark Mode Toggle
                      </strong>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--cds-text-secondary)",
                        }}
                      >
                        Quickly switch between light and dark backgrounds.
                      </span>
                    </div>
                    <Toggle
                      id="dark-mode-toggle"
                      labelA="Off"
                      labelB="On"
                      toggled={isDarkMode}
                      onToggle={toggleDarkMode}
                      aria-label="Toggle Dark Mode"
                    />
                  </div>

                  <Select
                    id="theme-select"
                    labelText="Active Theme Style"
                    helperText="Select one of Carbon's built-in themes for tailored contrast options."
                    value={theme}
                    onChange={handleThemeChange}
                  >
                    <SelectItem
                      value="white"
                      text="White Theme (High Contrast Light)"
                    />
                    <SelectItem
                      value="g10"
                      text="Gray 10 Theme (Soft Light - Default)"
                    />
                    <SelectItem
                      value="g90"
                      text="Gray 90 Theme (Deep Charcoal Dark)"
                    />
                    <SelectItem
                      value="g100"
                      text="Gray 100 Theme (High Contrast Dark)"
                    />
                  </Select>

                  <div
                    style={{
                      padding: "1rem",
                      borderLeft: "4px solid var(--cds-link-primary)",
                      background: "var(--cds-layer-02)",
                      fontSize: "13px",
                      color: "var(--cds-text-secondary)",
                      lineHeight: "1.45",
                    }}
                  >
                    Carbon themes inject custom CSS properties into the layout
                    tree, updating colors for headers, tables, buttons, and form
                    components dynamically.
                  </div>
                </Stack>
              </Stack>
            </Tile>
          </Column>

          {/* ── Workspace Identity Section ── */}
          <Column sm={4} md={8} lg={8}>
            <Tile className="dashboard-section" style={{ height: "100%" }}>
              <Stack gap={5}>
                <Stack
                  className="dashboard-section__header"
                  gap={2}
                  style={{ padding: "0 0 1rem 0" }}
                >
                  <h2
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Workspace size={20} /> Church Identity
                  </h2>
                  <p>
                    Set up standard values for localized reports, schedules, and
                    communication channels.
                  </p>
                </Stack>

                <Stack
                  gap={4}
                  className="dashboard-section__body"
                  style={{ padding: 0 }}
                >
                  <TextInput
                    id="workspace-name-input"
                    labelText="Church Name"
                    placeholder="Enter congregation or organization name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />

                  <Select
                    id="language-select"
                    labelText="Preferred Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                  >
                    <SelectItem value="en" text="English (United States)" />
                    <SelectItem value="lg" text="Luganda" />
                    <SelectItem value="sw" text="Kiswahili" />
                    <SelectItem value="fr" text="French" />
                  </Select>

                  <Select
                    id="timezone-select"
                    labelText="Timezone Offset"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <SelectItem value="EAT" text="East Africa Time (UTC+3)" />
                    <SelectItem
                      value="GMT"
                      text="Greenwich Mean Time (UTC+0)"
                    />
                    <SelectItem
                      value="EST"
                      text="Eastern Standard Time (UTC-5)"
                    />
                  </Select>
                </Stack>
              </Stack>
            </Tile>
          </Column>
        </Grid>

        {/* ── Additional Guidance Tile ── */}
        <Tile
          className="dashboard-section"
          style={{
            background:
              "linear-gradient(135deg, var(--cds-background) 0%, var(--cds-layer-02) 100%)",
            border: "1px solid var(--cds-border-subtle)",
          }}
        >
          <Stack gap={2} style={{ padding: "0.25rem" }}>
            <h3
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                color: "var(--cds-text-primary)",
                fontSize: "15px",
                fontWeight: "600",
              }}
            >
              <Help size={18} style={{ color: "var(--cds-link-primary)" }} />{" "}
              Looking for more preferences?
            </h3>
            <p
              style={{
                color: "var(--cds-text-secondary)",
                fontSize: "13px",
                margin: 0,
              }}
            >
              Administrators can configure role-based access control, database
              backup intervals, and email SMTP server settings by editing the
              local config file or contacting support at{" "}
              <a
                href="mailto:support@faithops.org"
                style={{
                  color: "var(--cds-link-primary)",
                  textDecoration: "underline",
                }}
              >
                support@faithops.org
              </a>
              .
            </p>
          </Stack>
        </Tile>
      </Stack>
    </Stack>
  );
}
