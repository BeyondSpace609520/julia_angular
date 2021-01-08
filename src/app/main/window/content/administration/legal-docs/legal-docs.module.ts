import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { SharedModule as UIKitModule } from "easybooking-ui-kit/shared.module";

import { HttpModule } from "@/app/shared/http.module";
import { LegalDocsComponent } from "./legal-docs.component";

@NgModule({
  declarations: [LegalDocsComponent],
  imports: [CommonModule, UIKitModule, HttpModule.forRoot()],
  entryComponents: [LegalDocsComponent],
})
export class LegalDocsModule {}
