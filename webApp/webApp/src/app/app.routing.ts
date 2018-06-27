//Importar Modulos del router de Angular
import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Importar Componentes
import { IdentityComponent } from './pages/identity/identity.component';
import { PubkeyComponent } from './pages/pubkey/pubkey.component';
import { RawTransactionComponent } from './pages/raw-transaction/raw-transaction.component';
import { GetPublicKeyComponent } from './pages/get-public-key/get-public-key.component';
import { LoginComponent } from './pages/login/login.component';
import { Route404Component } from './pages/route404/route404.component';

// Array de rutas
const  appRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    /*
    { path: 'identity', component: IdentityComponent },
    { path: 'pubkey', component: PubkeyComponent },
    { path: 'sendRawTransaction', component: RawTransactionComponent },
    { path: 'getpubkey', component: GetPublicKeyComponent },
    */
    { path: 'login', component: LoginComponent },
    { path: '**', component: Route404Component }, //Ruta 404
];

//Exportar el modulo del router
export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);