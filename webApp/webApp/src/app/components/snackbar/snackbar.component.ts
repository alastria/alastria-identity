import { Component, OnInit } from '@angular/core';

import { NotificationsService } from '../../services/notifications.service'

import {MatSnackBar, MatSnackBarConfig} from '@angular/material';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html'
})
export class SnackbarComponent implements OnInit {

  constructor(
    public snackBar: MatSnackBar, 
    public notificationsService: NotificationsService
  ) { }

  ngOnInit() {
    this.notificationsService.notifications$.subscribe(notification => {
      this.openNotification(notification);
    });
  }

  private openNotification( message : string) {
    let config = new MatSnackBarConfig();
    config.duration = 3000;
    let dialogRef = this.snackBar.open(message, 'Close', config);
  }

}
