## Shared modules for MDI windows

Use this folder only for shared modules used in multiple windows.  
Do not store independent pipes or services that may be associated with the entire application, not just windows

## Communication between a MDI windows

EventBusService allows to communicate between windows without a tight coupling (example, calendar-html)

- inject `EventBusService` to the component
- declare event types in `./events.ts` along with the component that receives events
```ts
export interface DoSomethingEvent {
    name: <name>;
    data: <data type>;
}
```
- Subscribe to event in current component
```ts
// don't forget to unsubscribe on component destroy (use the untilDestroyed)
this.eventBus.on<DoSomethingEvent>(<name>).pipe(untilDestroyed(this)).subscribe(() => {
    // do something
});
```
- Emit the event from a friendly component
```ts
this.eventBus.emit<DoSomethingEvent>(<name>, data);
```
