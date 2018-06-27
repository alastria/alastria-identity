//Modulos
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl, FormBuilder } from '@angular/forms';

//Importar Modelos
import { IdentityCreation } from '../../model/IdentityCreation';
import {ResponsePubKey} from "../../model/response-pub-key";


//Importar Servicios
import { NotificationsService } from '../../services/notifications.service'
import { AlastriaService } from '../../services/Alastria.service'

@Component({
  selector: 'app-get-public-key',
  templateUrl: './get-public-key.component.html',
  styleUrls: ['./get-public-key.component.css']
})
export class GetPublicKeyComponent implements OnInit {

  alastria_id: string = "";
  formGroup: FormGroup;

  mostrarPubkey: boolean = false;

  responsePubKey: ResponsePubKey = new ResponsePubKey("", "");

  constructor(
    private _formBuilder: FormBuilder,
    private _notificationsService: NotificationsService,
    private _alastriaService: AlastriaService
  ) { }

  ngOnInit() {

    this.formGroup = this._formBuilder.group({
      'alastria_id': new FormControl(this.alastria_id, [Validators.required])
    });

  }

  onSubmit() {
    this.mostrarPubkey = false;

    let value = this.formGroup.value;
    console.log(value);

    this._alastriaService.findSolicitation(value.alastria_id).subscribe(
      (response) => {
         console.log(response);
         this.responsePubKey.pubkey = response.pubkey;
         this.responsePubKey.alastria_id = response.alastria_id;
         this.mostrarPubkey = true;
         this._notificationsService.notify("Todo OK");
      },
      (err) => {  this._notificationsService.notify("Ha sucedido un error"); }
    )

  }

  clear(myForm: NgForm): void {
    myForm.resetForm();
  }

}
