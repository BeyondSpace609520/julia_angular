import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveComponentLoaderModule } from '@wishtack/reactive-component-loader';

import { SharedModule } from '@/app/shared/module';
import { EmbedComponent } from './embed.component';
import { EmbedService } from './embed.service';

export const reactiveEmbedModules = [
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'qualityCenter',
    loadChildren: './main/embed/content/quality-center/quality-center.module#QualityCenterModule'
  }),
  ReactiveComponentLoaderModule.withModule({
    moduleId: 'messageCenter',
    loadChildren: './main/embed/content/message-center/message-center.module#MessageCenterModule'
  }),
];

@NgModule({
  declarations: [EmbedComponent],
  exports: [EmbedComponent],
  imports: [
    CommonModule,
    SharedModule,
    ReactiveComponentLoaderModule.forRoot(),
  ],
  providers: [
    EmbedService
  ]
})
export class EmbedModule { }
