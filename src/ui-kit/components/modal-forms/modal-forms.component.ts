import { LanguageService } from '@/app/i18n/language.service';
import { redirectWithPOST } from '@/app/main/window/utils';
import { environment } from '@/environments/environment';
import {
  Component, ComponentFactoryResolver, ComponentRef, EventEmitter, Input, OnInit, Output, Type, ViewChild, ViewContainerRef
} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {FormatService} from '../../services/format.service';

@Component({
  selector: 'app-modal-forms',
  templateUrl: './modal-forms.component.html',
  styleUrls: ['./modal-forms.component.scss']
})
export class ModalFormsComponent implements OnInit {
  @Input() academyScreenId: string;
  @Input() closable = false;
  @Input() cancelWithoutClosing = false;
  @Input() cancelIconWithoutClosing = false;
  @Input() checkboxForPrimaryButton = false;
  @Input() checkboxForPrimaryButtonLabel: string;
  @Input() hideCheckboxForPrimaryButton = false;
  @Input() textHead: string;
  @Input() textBody: string;
  @Input() extraButton = false;
  @Input() extraButtonLabel = 'general.buttonSave.text';
  @Input() extraButtonColor: string;
  @Input() extraButtonIcon: string;
  @Input() extraButtonIconPosition: string;
  @Input() modalType = 1;
  @Input() buttonSaveLabel = 'general.buttonSave.text';
  @Input() buttonCancelLabel = 'general.buttonCancel.text';
  @Input() buttonSaveIcon: string;
  @Input() primaryButtonColor: string;
  @Input() primaryButtonIconPosition = 'left';
  @Input() hidePrimaryButton = false;
  @Input() hideCancelButton = false;
  @Input() hideHeader = false;
  @Input() savePopOverTitle = 'roomplan.bookingEditSaveButtonErrorPopupTitle.text';
  @Input() isSaveProcessing = false;
  @Input() pages = 1;
  @Input() currentPage = 1;
  @Input() inverseBackgroundColors = false;
  @Input() fullWidthModalBody = false;
  @Input() whiteModalBody = false;
  @Input() modalHeaderWithElement = false;
  @Input() modalBodyTopBorder = false;
  @Input() textHeadParams: {[k: string]: string} | null = null;
  @Input() headerWithoutBorder = false;
  @Output() save = new EventEmitter<boolean>();
  @Output() extra = new EventEmitter();
  @Output() goToPage = new EventEmitter<number>();
  @Output() cancel = new EventEmitter();

  @ViewChild('bodyContainer', { read: ViewContainerRef, static: true }) bodyContainer: ViewContainerRef;

  public formStatus = false;
  public saveButtonPopOver: { label?: string, text: string }[];
  public priceCalculationInfo: {nightCount: number, roomTotalPrice: number, cmOrigPrice?: number};
  public checkboxForPrimaryButtonValue: boolean;

  constructor(
    public activeModal: NgbActiveModal,
    public formatService: FormatService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private languageService: LanguageService,
  ) { }

  onCancelWithoutClosing() {
    this.cancel.emit();
  }

  setBody<T>(body: Type<T>): T {
    this.bodyContainer.clear();
    const compFactory = this.componentFactoryResolver.resolveComponentFactory<T>(body);
    const compRef: ComponentRef<any> = this.bodyContainer.createComponent(compFactory);
    if (compRef.instance.formStatus) {
      this.formStatus = false;
      compRef.instance.formStatus.subscribe((value: boolean) => {
        this.formStatus = value;
      });
    } else {
      this.formStatus = true;
    }
    if (compRef.instance.isSaveTriggered) {
      compRef.instance.isSaveTriggered.subscribe(() => {
        if (this.formStatus) {
          this.onSave();
        }
      });
    }
    if (compRef.instance.saveButtonPopOver) {
      compRef.instance.saveButtonPopOver.subscribe((value: { label?: string, text: string }[]) => {
        this.saveButtonPopOver = value;
      });
    }
    if (compRef.instance.priceCalculationInfo) {
      compRef.instance.priceCalculationInfo.subscribe((value: {nightCount: number, roomTotalPrice: number, cmOrigPrice?: number}) => {
        this.priceCalculationInfo = value;
      });
    }
    return compRef.instance;
  }

  onGoToPage(page: number) {
    if (page > this.pages) {
      this.goToPage.emit(1);
    } else if (page < 1) {
      this.goToPage.emit(this.pages);
    } else {
      this.goToPage.emit(page);
    }
  }

  onSave(isExtraButton: boolean = false) {
    this.save.emit(isExtraButton);
  }

  close(status: boolean) {
    this.activeModal.close(status);
  }

  openReference() {
    if (this.academyScreenId) {
      redirectWithPOST(
        environment.remoteUrl + '/wo/Services/com/gotoacademy.php',
        {
          screen: this.academyScreenId,
          l_id: String(this.languageService.getLanguageId())
        }
      );
    }
  }

  public checkboxChange(checked: boolean) {
    this.formStatus = checked;
  }

  ngOnInit() {
    if (!this.extraButtonColor) {
      this.extraButtonColor = this.primaryButtonColor;
    }
  }

}
