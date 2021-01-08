## Date format

Don't use date formatting inside `*.component.ts` (dayjs or momentjs especially). 
There is `ebDate` pipe that format a date based on `df_format` from company details. 

- add `MainSharedModule` to imports
- `ebDate` will returns the date with time, `ebDate:false` doesn't append the time

## Form data

Use `FormDataService` to load general-purpose data for forms (dropdown options, etc.). There you can cache requests
