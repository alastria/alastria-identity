import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-create-account-dialog',
  templateUrl: './create-account-dialog.component.html',
  styleUrls: ['./create-account-dialog.component.css']
})
export class CreateAccountDialogComponent implements OnInit {

  form: FormGroup;
  user:string = "";
  password:string = "";
  repeatPassword:string = "";

  constructor(
      private fb: FormBuilder,
      private dialogRef: MatDialogRef<CreateAccountDialogComponent>,
      @Inject(MAT_DIALOG_DATA) data) { }

  ngOnInit() {
    this.form = this.fb.group({
        'user': new FormControl(this.user, [Validators.required]),
        'password': new FormControl(this.password, [Validators.required]),
        'repeatPassword': new FormControl(this.repeatPassword, [Validators.required]),
     });
  }

  save() {
      this.dialogRef.close(this.form.value);
  }

  close() {
      this.dialogRef.close();
  }

}
