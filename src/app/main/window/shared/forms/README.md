## Open file dialog

```ts
const file = await selectFileDialog(<accept attribute>);
```

## Normalize Start date and End date

Make sure that its not possible to select an end-date thats before the start-date and the other way around, not to select a start-date thats after the end-date

```ts
normalizeDateRange(this.form.get('fromDate') as FormControl, this.form.get('untilDate') as FormControl, untilDestroyed(this));
```

### Check all checkboxes via "All" form control

```ts
checkAllCheckboxes()
```