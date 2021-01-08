# Coding guidelines

## Gitflow

Development branch: `develop`

Feature and fix branches should be created from `develop`, and should be named `feature/<task name>`, where `task name` is the last part of the task url in Trello (e.g 123-new-feature-example). If there's no task in Trello, `task name` can be anything.

Naming convention: don't use camelCase or "_" (underscore), divide words with "-" (dash).

Make a Merge request (the code will be reviewed and merged)

## Reuse existing components/pipes/services

Find a doc for the required functionality by keywords in all `README.md` files in this repository
Or find domain-independent components in `src/ui-kit` (date picker, list view, loading indicator, modal, tabs, etc.)

## Recommended sizes of component (script, template, style)

Less than: 200 lines for the script, 100 lines for the template and 100 lines for the style files

## Prevent memory leak

Use `untilDestroyed` from `ngx-take-until-destroy` for observer subscriptions

## Templating

Use `.pug` instead of `.html` (except componets in `/src/ui-kit`).  Avoid direct changing of DOM (`document.querySelector*`, etc)

## CSS and methodologies

SMACSS is more preferred. Don't use BEM :)

Try to keep component styles empty, only use them for unique styles what are only used in the current component. Put every other styles in the global stylesheet (/src/styles/*)

Always prefer variables over direct values.

If possible don't use utility classes (like md-3, pt-2, etc).

## Dependencies

There are common dependencies that are already choosed to solve a specific problems:

- Auto size an input: `ngx-autosize-input`
- Format and parse date: `dayjs`
- Drag and resize elements: `angular2-draggable`
- WYSIWYG editor: `ngx-quill`
- Icons: `mdi`
- Parse and stringify query parameters: `query-string`
- Tooltip: `@ng-bootstrap/ng-bootstrap`
- Date picker, modal windows: `easybooking-ui-kit` (built in package)
- Save file: `file-saver`
- I18N: `'@ngx-translate/core`

## Typescript

Always type everything, don't use type 'any'. Even methods/functions returning nothing should have ':void' as type declaration.

Always use public/protected/private for methods and fields in every class/component.

Avoid using functions in templates, they can get fired on every change (even on mousemove), use pipes instead. If there's no pipe for the function, create one. The custom made pipes are stored in app/shared/pipes.

Don't use model classes, use interfaces. Classes adds a lot of unnecessary javascript code, and slow down compiling and affects performance.

Use cached data from CacheService if needed.

Execute all Angular CLI commands from npm instead of your global Angular CLI installation. E.g. `npm run ng new myComponent` instead of `ng new myComponent` or `npm run ng serve -- --port 4201` instead of `ng serve --port 4201`

For code-style always apply to [https://angular.io/guide/styleguide](Angular Style Guide) and `tslint`

Order variables alphabetically
  1. `@Input()`
  2. `@Output()`
  3. `ViewChild()` etc
  4. Public variables
  5. Private variables
  
Order functions alphabetically
  1. Public functions
  2. Private functions
  3. Angular hooks

## I18N

Find the translations in `/src/assets/i18n/<lang>.json` and use them wherever possible

Never update the files directly. Use the Translation Tool (see `/src/assets/i18n/README.md`)

## Naming conventions

Coming soon...

Additional
---

- https://angular.io/guide/styleguide



