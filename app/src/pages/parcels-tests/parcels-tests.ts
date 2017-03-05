import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { AlertController, NavController, NavParams } from 'ionic-angular';

import { Parcel } from '../../app/parcel';

import { ParcelService } from '../../providers/parcel-service';

/*

  Docs :
   - Introduction to lists : https://www.joshmorony.com/an-introduction-to-lists-in-ionic-2/
* 
* TODOs :
* refactor addItem, editItem and deleteItem ; could be a unique function with action (add, edit, delete) passed in parameter
* itemType: use a kind of enum ? to only allow "parcels", "tests" and "layers"
*/


enum Steps {
  Parcels,
  Tests,
  Layers
}

@Component({
  selector: 'page-parcels-tests',
  templateUrl: 'parcels-tests.html',
})
export class ParcelsTestsPage {

  pageTitle: string;
  stepNumber: number;
  stepName: string;
  items: any = [];
  parcels: Parcel[] = [];
  parcels2: any = [];
  index: number;


  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, public storage: Storage, public parcelService: ParcelService) {}

  ionViewDidLoad() {
    this.stepNumber = this.navParams.get('step');
    this.index = this.navParams.get('index');
    //console.log(this.index);
    this.parcelService.getParcels().then((value) => {
      this.parcels = value;
    });
    switch (this.stepNumber) {
      case Steps.Tests:
        this.pageTitle = "Tests";
        break;
      case Steps.Layers:
        this.pageTitle = "Couches";
        break;
      default:
        this.stepNumber = Steps.Parcels;
        this.pageTitle = "Parcelles";
        break;
    }
    this.stepName = Steps[this.stepNumber];
  }

  /**
   * Add a new item from a dialog.  
   * itemType : the kind of item we want to add (parcels, tests, layers)
   */
  addItem(itemType: string) {
    //TODO : adjust depending of the step ("Ajouter parcelle", "Ajouter couche"...)
    let prompt = this.alertCtrl.create({
      title: 'Ajouter un élément',
      inputs: [{
        name: 'name',
        placeholder: 'Nom'
      }],
      buttons: [
        {
          text: 'Annuler'
        },
        {
          text: 'Ajouter',
          handler: data => {
            let parcel = new Parcel();
            parcel.name = data['name'];
            //parcel.tests = [];
            this.parcels.push(parcel);
            this.setData("parcels");
          }
        }
      ]
    });

    prompt.present();
  }

  /**
   * Show a dialog allowing to edit an item. 
   * itemType : the kind of item we edit (parcels, tests, layers)
   */
  editItem(item, itemType: string) {
    let prompt = this.alertCtrl.create({
      title: 'Éditer',
      inputs: [{
        name: 'name',
        placeholder: 'Nom'
      }],
      buttons: [
        {
          text: 'Annuler'
        },
        {
          text: 'Enregistrer',
          handler: data => {
            let index = this.parcels.indexOf(item);
            let parcel = this.parcels[index];

            if (index > -1) {
              parcel.name = data['name'];
              this.setData("parcels");
            }
          }
        }
      ]
    });

    prompt.present();

  }

  /**
   * Delete the selected item. 
   * itemType : the kind of item that is deleted (parcels, tests, layers).
   */
  deleteItem(item, itemType: string) {

    let index = this.parcels.indexOf(item);

    if (index > -1) {
      this.parcels.splice(index, 1);
      this.setData("parcels");
    }
  }

  itemClicked(item) {
    //TODO : don't increment stepNumber if already at last step
    let itemIndex = this.items.indexOf(item);
    this.navCtrl.push(ParcelsTestsPage, { step: this.stepNumber + 1,  index: itemIndex});
  }

  /**
   * Set data to storage.  
   * key: the key to which we want to associate the value.
   */
  setData(key: string) {
    this.storage.set(key, JSON.stringify(this.parcels));
  }

  resetStorage() {
    this.storage.clear();
  }

}