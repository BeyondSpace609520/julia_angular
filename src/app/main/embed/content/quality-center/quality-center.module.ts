import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { QualityCenterComponent } from './quality-center.component';

@NgModule({
  declarations: [QualityCenterComponent],
  imports: [
    CommonModule
  ],
  entryComponents: [QualityCenterComponent]
})
export class QualityCenterModule { }
