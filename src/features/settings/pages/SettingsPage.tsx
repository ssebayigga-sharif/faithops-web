import { useState } from "react";
import {
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
  Help,
} from "@carbon/icons-react";
import { useAppTheme, CarbonTheme } from "../../../shared/hooks/useTheme";

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
    <div className="admin-page settings-page">
      <div className="admin-page__inner">
        {/* Responsive Header */}
        <div className="settings-page__header">
          <div className="settings-page__header-info">
            <h1 className="admin-page__title settings-page__title">
              <Settings size={24} /> Workspace Settings
            </h1>
            <p className="admin-page__subtitle">
              Configure your FaithOps workspace preferences, localization
              settings, and visual themes.
            </p>
          </div>
          <Button
            kind="primary"
            renderIcon={Save}
            size="md"
            onClick={handleSave}
            className="settings-page__save-btn"
          >
            Save Settings
          </Button>
        </div>

        {showNotification && (
          <InlineNotification
            kind="success"
            title="Settings Saved Successfully"
            subtitle="Your workspace preferences and theme options have been synced."
            lowContrast
            onCloseButtonClick={() => setShowNotification(false)}
            className="settings-page__notification"
          />
        )}

        <Grid fullWidth withRowGap className="settings-page__grid">
          {/* Visual Preferences */}
          <Column sm={4} md={8} lg={8}>
            <Tile className="dashboard-section settings-page__tile">
              <Stack gap={5}>
                <div className="settings-page__tile-header">
                  <h2 className="settings-page__tile-title">Visual Preferences</h2>
                  <p className="settings-page__tile-subtitle">
                    Customize your personal interface theme and accessibility options.
                  </p>
                </div>

                <div className="dashboard-section__body settings-page__tile-body">
                  <div className="settings-page__toggle-row">
                    <div className="settings-page__toggle-info">
                      <strong className="settings-page__toggle-label">
                        Dark Mode Toggle
                      </strong>
                      <span className="settings-page__toggle-desc">
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
                    className="settings-page__select"
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

                  <div className="settings-page__theme-note">
                    Carbon themes inject custom CSS properties into the layout
                    tree, updating colors for headers, tables, buttons, and form
                    components dynamically.
                  </div>
                </div>
              </Stack>
            </Tile>
          </Column>

          {/* Church Identity */}
          <Column sm={4} md={8} lg={8}>
            <Tile className="dashboard-section settings-page__tile">
              <Stack gap={5}>
                <div className="settings-page__tile-header">
                  <h2 className="settings-page__tile-title">
                    <Workspace size={20} /> Church Identity
                  </h2>
                  <p className="settings-page__tile-subtitle">
                    Set up standard values for localized reports, schedules, and
                    communication channels.
                  </p>
                </div>

                <div className="dashboard-section__body settings-page__tile-body">
                  <TextInput
                    id="workspace-name-input"
                    labelText="Church Name"
                    placeholder="Enter congregation or organization name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="settings-page__input"
                  />

                  <Select
                    id="language-select"
                    labelText="Preferred Language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="settings-page__select"
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
                    className="settings-page__select"
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
                </div>
              </Stack>
            </Tile>
          </Column>
        </Grid>

        {/* Help Banner */}
        <Tile className="settings-page__help-card">
          <div className="settings-page__help-content">
            <h3 className="settings-page__help-title">
              <Help size={18} className="settings-page__help-icon" />{" "}
              Looking for more preferences?
            </h3>
            <p className="settings-page__help-text">
              Administrators can configure role-based access control, database
              backup intervals, and email SMTP server settings by editing the
              local config file or contacting support at{" "}
              <a
                href="mailto:support@faithops.org"
                className="settings-page__help-link"
              >
                support@faithops.org
              </a>
              .
            </p>
          </div>
        </Tile>
      </div>
    </div>
  );
}
