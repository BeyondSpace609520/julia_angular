## MDI window content

Add module declarations to `reactiveModules` in `window.module.ts`

```ts
ReactiveComponentLoaderModule.withModule({
    moduleId: '<moduleId>',
    loadChildren: '<path to module>#<module class name>s'
})
```

Add component to entryComponents

Open window using
```js
this.windowsService.addWindow('title', id, { module: { moduleId, selector }})
```

### References:

- [Add link to menu](../../menu/README.md)

### Caution!

After adding a new module, restart `npm run start`