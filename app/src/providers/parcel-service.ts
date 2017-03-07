import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Parcel } from '../app/parcel';

@Injectable()
export class ParcelService {

  data: any;

  constructor(public storage: Storage) { }

  /**
   * Get data from Storage.  
   * key : the key associated to the desired values.  
   * Return : a Promise (from Storage)
   */
  load(key: string): Promise<any> {
    return this.storage.get(key).then((value) => {
      if (value != null) {
        this.data = JSON.parse(value);
      }
      else {
        console.log("Storage empty.");
      }
    });
  }

  /**
   * Save data using ionic Storage (key/value pair).  
   * key : key associated to the value.  
   * value : the value to save. 
   */
  save(key: string, value: any) {
    this.storage.set(key, JSON.stringify(value));
  }

  /**
   * Get parcels data.  
   * Return : a Promise
   */
  getParcels(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      if (this.data) { // data were previously loaded ; simply return them.
        resolve(this.data);
      } else {  // Must load data first.
        this.load("parcels").then(() => { resolve(this.data) });
      }
    });
  }
}
