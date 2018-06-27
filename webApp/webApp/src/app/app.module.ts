//Module
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { routing, appRoutingProviders } from './app.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Material Angular
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatChipsModule} from '@angular/material/chips';


//Service
import { AlastriaService } from './services/Alastria.service';
import { NotificationsService } from './services/notifications.service';
import { UserLoginService } from './services/user-login.service';

//Component
import { AppComponent } from './app.component';
import { IdentityComponent } from './pages/identity/identity.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HeaderComponent } from './components/header/header.component';
import { PubkeyComponent } from './pages/pubkey/pubkey.component';
import { RawTransactionComponent } from './pages/raw-transaction/raw-transaction.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { GetPublicKeyComponent } from './pages/get-public-key/get-public-key.component';
import { LoginComponent } from './pages/login/login.component';
import { LoginDialogComponent } from './pages/login-dialog/login-dialog.component';
import { CreateAccountDialogComponent } from './pages/create-account-dialog/create-account-dialog.component';
import { Route404Component } from './pages/route404/route404.component';


@NgModule({
  // Componentes, Directivas y Pipes
  declarations: [
    AppComponent,
    IdentityComponent,
    NavbarComponent,
    HeaderComponent,
    PubkeyComponent,
    RawTransactionComponent,
    SnackbarComponent,
    GetPublicKeyComponent,
    LoginComponent,
    LoginDialogComponent,
    CreateAccountDialogComponent,
    Route404Component
  ],
  // Modulos & Material
  imports: [
    BrowserModule,
    routing,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatListModule,
    MatChipsModule
  ],
  // Servicos
  providers: [appRoutingProviders, AlastriaService, NotificationsService, UserLoginService],
  bootstrap: [AppComponent],
  entryComponents: [LoginDialogComponent, CreateAccountDialogComponent]
})
export class AppModule { }
