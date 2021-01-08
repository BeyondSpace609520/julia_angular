import {
  Component, ComponentRef, OnInit, Type, ViewChild, ViewContainerRef, ComponentFactoryResolver
} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormatService } from '../../services/format.service';

@Component({
    selector: 'app-modal-borderless',
    templateUrl: './modal-borderless.component.html'
  })
export class ModalBorderlessComponent implements OnInit {
    @ViewChild('bodyContainer', { read: ViewContainerRef, static: true }) bodyContainer: ViewContainerRef;

    constructor(
      public activeModal: NgbActiveModal,
      public formatService: FormatService,
      private componentFactoryResolver: ComponentFactoryResolver
    ) { }

    setBody<T>(body: Type<T>): T {
      this.bodyContainer.clear();
      const compFactory = this.componentFactoryResolver.resolveComponentFactory<T>(body);
      const compRef: ComponentRef<any> = this.bodyContainer.createComponent(compFactory);

      return compRef.instance;
    }

    close(status: boolean) {
      this.activeModal.close(status);
    }

    ngOnInit() {}
}
