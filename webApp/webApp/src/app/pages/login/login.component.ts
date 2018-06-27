import { Component, OnInit } from '@angular/core';
//Module Dialog
import {MatDialog, MatDialogConfig} from "@angular/material";
//my dialog
import { LoginDialogComponent } from '../login-dialog/login-dialog.component';
import { CreateAccountDialogComponent } from '../create-account-dialog/create-account-dialog.component';

//Import Model
import {User} from '../../mock/user';
import {ResponsePubKey} from "../../model/response-pub-key";


//Import Services
import {AlastriaService} from '../../services/Alastria.service';
import { NotificationsService } from '../../services/notifications.service'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginCorrecto: boolean = false;
  public myUser: User;
  public responsePubKey: ResponsePubKey = new ResponsePubKey("", "");


  public checkPubKey: boolean = false;
  public isValidPubKey;

  constructor(
    private dialog: MatDialog,
    private _alastriaService: AlastriaService,
    private _notificationsService: NotificationsService
  ) { }

  ngOnInit() {
  }

  createAccount(){
    console.log("createAccount");
  }

  openLoginDialog() {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      id: 1,
      title: 'prueba'
    };

    const dialogRef = this.dialog.open(LoginDialogComponent, dialogConfig);

    dialogRef.afterClosed().subscribe( data => {
          if(data !== undefined){
            this.loginCorrecto = true;
            this.myUser = data;
            console.log("User: ", data);
          } 
        }
    );  
  }

  openCreateAccountDialog() {

    const dialogConfig2 = new MatDialogConfig();

    dialogConfig2.disableClose = true;
    dialogConfig2.autoFocus = true;

    dialogConfig2.data = {
      id: 1,
      title: 'prueba'
    };

    const dialogRef = this.dialog.open(CreateAccountDialogComponent, dialogConfig2);

    dialogRef.afterClosed().subscribe(
        data => console.log("User: ", data)
    );  
  }


  checkPublicKey(){

    this._alastriaService.findSolicitation(this.myUser.alastriaId).subscribe(
      (response) => {
         console.log(response);
         this.responsePubKey.pubkey = response.pubkey;
         this.responsePubKey.alastria_id = response.alastria_id;

         console.log(this.responsePubKey);
         this.checkPubKey = true;
         this._notificationsService.notify("todo ok");

        if(this.responsePubKey.pubkey === this.myUser.pubkey){ 
          this.isValidPubKey = true;
        }
        else this.isValidPubKey = false;
      },
      (err) => {  this._notificationsService.notify("Error en el servidor"); }
    )
  }

  exit(){
     this.loginCorrecto = false;
     this.myUser = undefined;
     this.responsePubKey = new ResponsePubKey("", "");


    this.checkPubKey = false;
    this.isValidPubKey = undefined;
  }

}
