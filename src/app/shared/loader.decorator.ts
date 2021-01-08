import { ModalService } from 'easybooking-ui-kit/services/modal.service';

import { UserError } from '../helpers/user-error';
import { LoaderService } from './loader.service';

// Component should have loaderService property with LoaderService instance
// 'modalService' property is optional, serves to show UserError exceptions
export function Loading(id: string): MethodDecorator {
    return (target: any, key: string, descriptor: any) => {
      const originalMethod = descriptor.value;

      descriptor.value =  async function(...args: any[]) {
        const service = this.loaderService as LoaderService;
        const modal = this.modalService as ModalService;

        if (!service || !(service instanceof LoaderService)) {
          throw new Error('\'loaderService\' not found or not LoaderService instance');
        }

        service.show(id);
        let result;
        try {
           result = await originalMethod.apply(this, args);
        } catch (e) {
          if (modal && e instanceof UserError) {
            modal.openSimpleText(e.message);
          }
          throw e;
        } finally {
          service.hide(id);
        }

        return result;
      };

      return descriptor;
    };
}
