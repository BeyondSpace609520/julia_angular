### How to use

Import the module into your module
```js
import { SharedModule as EasybookingUISharedModule } from 'easybooking-ui-kit/shared.module';

...
imports: [
    EasybookingUISharedModule
]
```

### Format number

For input fields use `appNumberInput` directive  
For static text formatting use `formatNumber` pipe

### Open modals

```js
// inject
    private modal: ModalService,


// open simple
this.modal.openSimpleText('i18n title');

// confirmation modal
const confirmed = await this.modal.openConfirm('i18n title', 'i18n text');

// with body
const modalInstance = this.modal.openForms('i18n title', BodyComponent, options);

// pass data to your body component
modalInstance.modalBody.init(args);

// subscribe to buttons
modalInstance.modal.save.subscribe(...

// close modal
modalInstance.modal.close(true);
```
