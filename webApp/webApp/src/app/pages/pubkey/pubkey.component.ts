//Modulos
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';

//Importar Modelos
import { UpdatePK } from '../../model/UpdatePK';

//Importar Servicios
import { NotificationsService } from '../../services/notifications.service'

@Component({
  selector: 'app-pubkey',
  templateUrl: './pubkey.component.html',
  styleUrls: ['./pubkey.component.css']
})
export class PubkeyComponent implements OnInit {

  updatePK: UpdatePK = new UpdatePK("", "");
  formGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      'alastria_id':  new FormControl(this.updatePK.alastria_id, [Validators.required]),
      'public_key':  new FormControl(this.updatePK.public_key, [Validators.required]),
    });

  }

  onSubmit(){
    console.log(this.formGroup.value);
    this._notificationsService.notify("ok");
  }

  clear(myForm: NgForm): void {
    myForm.resetForm();
  }


}
