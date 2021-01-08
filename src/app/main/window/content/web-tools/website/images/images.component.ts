import { Component, OnInit, ViewChild } from '@angular/core';

import { PicturesComponent } from '@/app/main/window/shared/image-selector/pictures.component';
import { TabsSettings } from '@/ui-kit/components/tabs/tabs.models';
import { WebsitePictureSource } from '../models';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.pug',
  styleUrls: ['./images.component.sass']
})
export class ImagesComponent implements OnInit {

  tabSettings: TabsSettings = {
    buttons: [
      {
        id: 'summer',
        label: 'BackEnd_WikiLanguage.CG_CompanyImageSummer'
      },
      {
        id: 'winter',
        label: 'BackEnd_WikiLanguage.CG_CompanyImageWinter'
      }
    ],
    buttonClasses: ['nav-link']
  };

  activeTabId: WebsitePictureSource = 'summer';

  @ViewChild('picturesComponent', { static: true }) picturesComponent: PicturesComponent<{ id?: number }>;

  constructor() { }

  ngOnInit() {
  }

}
