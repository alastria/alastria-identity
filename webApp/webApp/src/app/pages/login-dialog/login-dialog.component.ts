import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

//Import Service
import {UserLoginService} from '../../services/user-login.service';
import {NotificationsService} from '../../services/notifications.service';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {

  form: FormGroup;
  user:string = "";
  password:string = "";

  constructor(
      private _userLoginService: UserLoginService,
      private _notificationsService: NotificationsService,
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<LoginDialogComponent>,
      @Inject(MAT_DIALOG_DATA) data,
    ) { }

  ngOnInit() {
      this.form = this.fb.group({
         'user_name': new FormControl(this.user, [Validators.required]),
         'password': new FormControl(this.password, [Validators.required]),
      });
  }

  save() {
    let user_name: string;
    let index: number;

    user_name = this.form.value.user_name;
    
    index = this._userLoginService.existUser(user_name);
    console.log(index);

    if(index===-1){
        this._notificationsService.notify("Error no existe dicho usuario");
        console.log("Error no existe dicho usuario")
    }
    else{
        this._notificationsService.notify("Login Correcto");
        this.dialogRef.close(this._userLoginService.getUser(index));
    }
  }

  close() {
      this.dialogRef.close();
  }

}
