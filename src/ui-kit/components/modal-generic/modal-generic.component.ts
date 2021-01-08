import {Component, ComponentFactoryResolver, ComponentRef, Input, OnInit, Type, ViewChild, ViewContainerRef} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-generic',
  templateUrl: './modal-generic.component.html',
  styleUrls: ['./modal-generic.component.scss'],
})
export class ModalGenericComponent implements OnInit {
  @Input() closableWithIcon: boolean;
  @Input() textHead: string;
  @Input() closable = true;
  @Input() buttonCloseLabel = 'OK';
  @Input() buttonClass = 'btn-primary';
  @Input() hideHeader = false;
  @ViewChild('bodyContainer', { read: ViewContainerRef, static: true }) bodyContainer: ViewContainerRef;
  @ViewChild('shortcutsContainer', { read: ViewContainerRef, static: true }) shortcutsContainer: ViewContainerRef;

  constructor(
    public activeModal: NgbActiveModal,
    private componentFactoryResolver: ComponentFactoryResolver
  ) { }

  setBody<T>(body: Type<T>): T {
    this.bodyContainer.clear();
    const compFactory = this.componentFactoryResolver.resolveComponentFactory<T>(body);
    const compRef: ComponentRef<any> = this.bodyContainer.createComponent(compFactory);
    return compRef.instance;
  }

  setShortcuts<T>(shortcuts: Type<T>): T {
    this.shortcutsContainer.clear();
    const compFactory = this.componentFactoryResolver.resolveComponentFactory<T>(shortcuts);
    const compRef: ComponentRef<T> = this.shortcutsContainer.createComponent(compFactory);
    return compRef.instance;
  }


  ngOnInit() {
  }
}
