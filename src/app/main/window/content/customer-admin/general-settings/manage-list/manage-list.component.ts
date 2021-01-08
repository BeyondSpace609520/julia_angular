import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { MainService } from '@/app/main/main.service';

@Component({
  selector: 'app-manage-list',
  templateUrl: './manage-list.component.pug',
  styleUrls: ['./manage-list.component.sass']
})
export class ManageListComponent implements OnInit {

  @Input() onlyImportant = false;
  @Input() disabled = false;
  @Output() langChange = new EventEmitter<number>();
  @Output() new = new EventEmitter<string>();
  @Output() save = new EventEmitter<string>();

  important = ['English', 'German'];

  lang = this.languages[0].value;

  constructor(
    private mainService: MainService
  ) { }

  // TODO use getLocals from FormDataService
  get languages() {
    return this.mainService.getCompanyDetails().languagesDataProvider.map(l => ({
      value: l.l_id,
      name: l.l_nameDisplay
    })).filter(l => !this.onlyImportant || this.important.includes(l.name));
  }

  ngOnInit() {
    this.langChange.emit(+this.languages[0].value);
  }
}
