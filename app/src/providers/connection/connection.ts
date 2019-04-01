import { Injectable } from '@angular/core';
import { UserType } from '../../models/user';
import * as forge from "node-forge";
import { DataService } from '../data-service';

/*
  Generated class for the ConnectionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConnectionProvider {

  accessAuthorized : { [userType: string] : boolean} = {};
  hashTable : { [userType: string] : string } = {};

  readonly HASH_TERRE_VIVANTE = "";


  constructor(private dataService: DataService) 
  {
    this.dataService.getAuthList().then(list => {
      if(list !== null && list !== undefined )
        this.accessAuthorized = list;
      else{
        this.accessAuthorized = {};
      }
    });

    this.hashTable[UserType.Ofag as string] = this.HASH_TERRE_VIVANTE;
  }

  checkPassword(type: string, challenge: string){
      let hash_challenge = forge.md.sha256.create();
      hash_challenge.update(challenge);
      
      if (hash_challenge.digest().toHex() === this.hashTable[type]) {
        this.accessAuthorized[type] = true;
        
        this.dataService.setAndSaveConnectionsInfo(this.accessAuthorized);
        return true;
      }

    return false;
  }

  isAuth(type: string){
    return this.accessAuthorized && this.accessAuthorized[type];
  }

}
