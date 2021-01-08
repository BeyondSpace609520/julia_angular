import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { UserService } from '@/app/auth/user.service';
import { ApiClient } from '@/app/helpers/api-client';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { LoaderType } from '../../loader-types';
import { LoginMessage } from '../../models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.pug',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  form: FormGroup;

  editorConfig = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{color: [] }],
      [{align: [] }],
      [{list: 'ordered'}, {list: 'bullet'}]
    ]
  };

  constructor(
    private apiClient: ApiClient,
    private userService: UserService,
    public loaderService: LoaderService,
  ) { }

  @Loading(LoaderType.TAB)
  async ngOnInit() {
    const { hotelId } = this.userService;
    if (!hotelId) {
      return;
    }
    const data = await this.apiClient.getLoginMessage(hotelId).toPromise();

    this.form = new FormGroup({
      active: new FormControl(data.active),
      title: new FormControl(data.title),
      message: new FormControl(data.message),
    });
  }

  @Loading(LoaderType.TAB)
  async save() {
    const { hotelId } = this.userService;
    if (!hotelId) {
      return;
    }
    const { active, title, message } = this.form.getRawValue();
    const data: LoginMessage = {
      active,
      title,
      message
    };

    await this.apiClient.setLoginMessage(hotelId, data).toPromise();
  }
}
