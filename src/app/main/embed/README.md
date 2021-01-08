## Embed component or iframe over the page

Similar to MDI window content this module allow a lazy loading of modules expect one thing - embedding component to any position on the page  (example: Quality center)

- add module declarations to `reactiveEmbedModules` in `window.module.ts`
- create your module and component to `./content/<name>`
- add component to entryComponents of your module

Open Embed window using
```ts
const contentSource = {
    "embed": {
        "moduleId": "qualityCenter",
        "selector": "app-quality-center"
    }
}
this.embedService.open(contentSource);
```