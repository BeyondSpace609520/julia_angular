## Loading indicator

- add `SharedModule` from ui-kit to imports of your module
- inject `private loaderService: LoaderService`
- create `loader-types.ts` and add `enum LoaderType` for your module (can be nested enums for large modules)
- import `Loading` decorator from `./loader.decorator.ts` and add to async method with an argument of type `LoaderType`
- add `app-loading.loading-bar(*ngIf="isLoading | async")` to your template
- add the field `isLoading: Observable<boolean>`
- setup the observable in the beginning of the constructor
```js 
  // in case of a single loader type
  this.isLoading = this.loaderService.isLoading(<LoaderType id>);
   
  // in case of a multiple loader types
  this.isLoading = this.loaderService.isLoadingAnyOf([<LoaderType id>, <LoaderType id>, ...]);
```
