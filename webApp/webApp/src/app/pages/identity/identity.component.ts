//Modulos
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

//Importar Modelos
import { IdentityCreation } from '../../model/IdentityCreation';

//Importar Servicios
import { NotificationsService } from '../../services/notifications.service'

@Component({
  selector: 'identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.css']
})
export class IdentityComponent implements OnInit {

  identityCreation: IdentityCreation = new IdentityCreation("", "", "");
  formGroupIdentity: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _notificationsService: NotificationsService
  ) { }

  ngOnInit() {

    this.formGroupIdentity = this._formBuilder.group({
      'alastria_token': new FormControl(this.identityCreation.alastria_token, [Validators.required]),
      'public_key': new FormControl(this.identityCreation.public_key, [Validators.required]),
      'transaction': new FormControl(this.identityCreation.transaction, [Validators.required]),
    });

  }

  onSubmit() {
    console.log(this.formGroupIdentity.value);
    this._notificationsService.notify("ok");
  }

  clear(myForm: NgForm): void {
    myForm.resetForm();
  }

}
