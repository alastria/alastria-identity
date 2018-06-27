//Modulos
import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl, FormBuilder} from '@angular/forms';

//Importar Modelos
import { SendRawTransaction } from '../../model/SendRawTransaction';

//Importar Servicios
import { NotificationsService } from '../../services/notifications.service'

@Component({
  selector: 'app-raw-transaction',
  templateUrl: './raw-transaction.component.html',
  styleUrls: ['./raw-transaction.component.css']
})
export class RawTransactionComponent implements OnInit {

  sendRawTransaction: SendRawTransaction = new SendRawTransaction("");
  formGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private _notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.formGroup = this._formBuilder.group({
      'raw_transaction':  new FormControl(this.sendRawTransaction.raw_transaction, [Validators.required]),
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
