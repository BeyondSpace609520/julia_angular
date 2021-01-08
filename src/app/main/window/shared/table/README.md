## Sorting in table

- add `TableModule` to `imports` of your module
- add `sortable="<column name>"` attribute in the table `th` and `(sort)="sort($event)"`
- declare items and `sortedItems` in your component
- `*ngFor` should render data from `sortedItems`
-  decare your sort method with `sort` from './sort.ts' which receive items and returns array to sortedItems

Also you can to customize `th` using `.asc` or `.desc` classes

## Action buttons in table fields

In most cases `app-table-action` component will suite for action buttons with tooltips

- add `TableModule` to `imports` of your module
- add to template:
```
    app-table-action(
        [active]="condition",
        tooltip="text or key path from i18n",
        [rightTooltip]="rightPlacementOfTooltip",
        icon="icon name from MDI without mdi- prefix",
        (clicked)="clickHandler()"
    )
```