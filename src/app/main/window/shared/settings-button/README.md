## Settings button for a MDI window

This module adds a button that opens another window

- add `SettingsButtonModule` to imports
- add to template:
```
app-settings-button(
    moduleId="<moduleId from WindowContentSource>",
    selector="<selector from WindowContentSource>",
    title="<text or i18n text>"
)
```