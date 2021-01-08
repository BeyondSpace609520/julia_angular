import {Component, EventEmitter, Input, OnChanges, OnInit, Output, ChangeDetectorRef} from '@angular/core';
import {TabsSettings, TabsButton} from './tabs.models';

const defaultButtonClasses = ['nav-link'];

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, OnChanges {
  @Input() settings: TabsSettings;
  @Input() selected: string | null;
  @Output() selectedChange = new EventEmitter<string>();

  constructor(private cd: ChangeDetectorRef) { }

  onSelect(id: string) {
    this.selected = id;
    this.selectedChange.emit(this.selected);
  }

  getButtonClasses(id: string): string | null {
    if (this.settings && this.settings.buttons) {
      let classes: string[] = defaultButtonClasses;
      const button = this.settings.buttons.find(buttonItem => buttonItem.id === id);
      if (this.settings.buttonClasses && this.settings.buttonClasses.length > 0) {
        classes = classes.concat(this.settings.buttonClasses);
      }
      if (button && typeof button.classes !== 'undefined') {
        classes = classes.concat(button.classes);
      }
      return classes.join(' ');
    }
    return null;
  }

  getButtonStatus(button: TabsButton) {
    if (button.disabled && this.selected === button.id) {
      const firstAvaliableTab = this.settings.buttons.find(b => !b.disabled);

      this.onSelect(firstAvaliableTab ? firstAvaliableTab.id : '');
      this.cd.detectChanges();
    }
    
    return { disabled: button.disabled, active: this.selected === button.id };
  }

  ngOnInit() { }

  ngOnChanges() {
    if (this.selected && !(this.settings && this.settings.buttons && this.settings.buttons.filter(button => button.id === this.selected).length > 0)) {
      // if there's no button with the selected id reset selected
      this.selected = null;
    }
    
    if (this.settings && this.settings.buttons && !this.selected) {
      // if there's no selected set but there are buttons, select the first of it
      this.selected = this.settings.buttons[0].id;
    }
  }

}
