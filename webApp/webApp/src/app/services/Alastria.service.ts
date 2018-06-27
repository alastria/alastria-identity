//MODEL
import {ApplicationError} from "../model/ApplicationError";
import {IdentityCreation} from "../model/IdentityCreation";
import {Response1} from "../model/Response1";
import {Response2} from "../model/Response2";
import {Response3} from "../model/Response3";
import {Response4} from "../model/Response4";
import {Response5} from "../model/Response5";
import {RpcError} from "../model/RpcError";
import {SendRawTransaction} from "../model/SendRawTransaction";
import {UpdatePK} from "../model/UpdatePK";

import {ResponsePubKey} from "../model/response-pub-key";


import { Injectable } from "@angular/core";

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs/internal/Observable";




const httpOptions = {
    headers: new HttpHeaders({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
  };

@Injectable()
export class AlastriaService {

    // URL to web api
    private baseURL = "http://localhost:8080";

    private alastriaUrl = this.baseURL + "/alastria"; 

    constructor(
        private http: HttpClient 
    ) { }

    //POST
    addIdentity (identityCreation: IdentityCreation): any {
	    return this.http.post<Response3>(this.alastriaUrl+"/identity", identityCreation, httpOptions);
    }

    addPubkey (updatePK: UpdatePK): any {
	    return this.http.post<Response1>(this.alastriaUrl+"/pubkey", updatePK, httpOptions);
    }

    addRawTransaction (sendRawTransaction: SendRawTransaction): any {
	    return this.http.post<Response5>(this.alastriaUrl+"/raw", sendRawTransaction, httpOptions);
    }

    //GET
    //queryString revisar
    
    getSolicitations(call : string): Observable<Response2> {
        let Params = new HttpParams();
        Params = Params.append("call", call);

        return this.http.get<any>(this.alastriaUrl, { params: Params });
    }

    findSolicitation(alastria_id : String): Observable<ResponsePubKey> {
        return this.http.get<any>(this.alastriaUrl + "/pubkey" + "/" + alastria_id, httpOptions);
    }



}