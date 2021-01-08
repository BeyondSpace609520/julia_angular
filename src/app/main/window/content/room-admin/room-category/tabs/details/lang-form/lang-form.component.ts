import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-category-lang-form',
  templateUrl: './lang-form.component.pug',
  styleUrls: ['./lang-form.component.sass']
})
export class LangFormComponent implements OnInit {

  @Input() label!: string;
  @Input() form!: FormControl;

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{color: [] }],
      [{align: [] }],
      [{list: 'ordered'}, {list: 'bullet'}]
    ]
  };

  constructor() { }

  ngOnInit() {
  }

}
