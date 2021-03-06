import { Steps } from './../../models/parcel';
import { ModalPicturePage } from "./../modal-picture/modal-picture";
import { UserType } from "./../../models/user";
import { Component } from "@angular/core";
import { Storage } from "@ionic/storage";
import {
  AlertController,
  NavController,
  NavParams,
  ModalController
} from "ionic-angular";

import { Parcel, Test } from "../../models/parcel";
import { User } from "../../models/user";
// Pages
import { GifViewPage } from "../gif-view/gif-view";
// Providers
import { DataService } from "../../providers/data-service";
import { Toasts } from "./../../providers/toasts";
import { TranslateProvider } from "../../providers/translate/translate";
import { Utils } from "../../providers/utils";

enum ParcelTestNavigationStep {
  Parcels,
  Tests
}

@Component({
  selector: "page-parcels-tests",
  templateUrl: "parcels-tests.html"
})
export class ParcelsTestsPage {
  public pageTitle: string;
  public listHeader: string;
  private navigationStep: ParcelTestNavigationStep;
  public stepName: string;
  public listItems: any = [];
  private parcels: Parcel[] = [];
  private user: User;
  private currentParcel: Parcel;
  public editMode: Boolean = false;
  private isConsultation: Boolean;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public dataService: DataService,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    public storage: Storage,
    private toasts: Toasts,
    private translate: TranslateProvider
  ) { }

  ionViewDidLoad() {
    this.isConsultation = this.navParams.get("isConsultation");
    this.navigationStep = this.navParams.get("step");
    this.dataService.getParcels().then(value => {
      if (value != null) {
        this.parcels = value;
        this.currentParcel = this.dataService.getCurrentParcel();
      }

      switch (this.navigationStep) {
        case ParcelTestNavigationStep.Tests:
          this.pageTitle = this.translate.get("TESTS");
          this.listHeader = this.translate.get("PARCEL_NAME", {
            name: this.currentParcel.name
          });

          // Gets the completed tests if in Consultation mode, or the not completed ones if in Notation mode.
          this.listItems = this.currentParcel.tests.filter(
            test => test.isCompleted === this.isConsultation
          );
          break;

        default:
          // Steps.Parcels, hopefully
          this.navigationStep = ParcelTestNavigationStep.Parcels;
          this.pageTitle = this.isConsultation ? this.translate.get("PARCELS") : this.translate.get("PARCELS_TO_TEST");
          if (!this.isConsultation && this.parcels.length === 0) {
            // No existing parcel; open the dialog to add a new one.
            this.addItem();
          }
          this.listItems = this.parcels;
          break;
      }
      this.stepName = ParcelTestNavigationStep[this.navigationStep];
    });

    //Todo : should not create a new user here if non-existent
    if (!this.user) {
      this.dataService.getUserInfo().then(value => {
        if (value != null) {
          this.user = value;
        } else {
          this.user = new User({
            firstName: "",
            lastName: "",
            userType: UserType.Anonymous,
            mail: "",
            idOfag: "",
            language: ""
          });
        }
      });
    }
  }

  /**
   * Add a new item (Parcel).
   */
  protected addItem() {
    let inputsList: any;
    switch (this.navigationStep) {
      case ParcelTestNavigationStep.Parcels:
        if (this.user.userType == UserType.Ofag) {
          inputsList = [
            {
              name: "name",
              placeholder: this.translate.get("NAME"),
              value: this.translate.get("PARCEL") + " "
            },
            {
              name: "ofag",
              placeholder: this.translate.get("PARCEL_ID"),
              value: this.user.idOfag
            }
          ];
        } else {
          inputsList = [
            {
              name: "name",
              placeholder: this.translate.get("NAME"),
              value: this.translate.get("PARCEL") + " "
            }
          ];
        }
        break;
    }

    let prompt = this.alertCtrl.create({
      title: this.translate.get("ADD"),
      inputs: inputsList,
      buttons: [
        {
          text: this.translate.get("CANCEL")
        },
        {
          text: this.translate.get("VALIDATE"),
          handler: data => {
            switch (this.navigationStep) {
              case ParcelTestNavigationStep.Parcels:
                let parcelId = this.parcels.length > 0
                    ? this.parcels[this.parcels.length - 1].id + 1
                    : 1;
                let parcel = new Parcel({
                  id: parcelId,
                  name: data["name"],
                  ofag: data["ofag"]
                });
                this.parcels.push(parcel);
                this.dataService.saveParcels();
                break;
            }
          }
        }
      ]
    });
    prompt.present();
  }

  protected editItem(item: Parcel | Test) {
    // TODO
    // Basically the same as AddItem, except we need to get the item selected
    // and show its actual values in the formular.
    // See also the manageItem method ; it wasn't complete but shows a way to
    // get the selected item.
    this.toasts.showToast(
      this.translate.get("FUNCTIONALITY_NOT_YET_AVAILABLE")
    );
  }

  /**
   * OLD FUNCTION - not used anymore. Kept to help making the new editItem method.
   * Edit an item.
   * event : event that was fired.
   * action : the action to do with the item (add, edit or delete)
   * item : the selected item.
   * itemType : thonverting circular structure to JSON kind of item we edit (parcels, tests)
   */
  // manageItem(event, action: string, item: any, itemType: number) {
  //   event.stopPropagation();

  //   let title;
  //   let itemId;
  //   if (item instanceof Parcel) {
  //     console.log("it's a Parcel");
  //   }
  //   switch (action) {
  //     case "edit":
  //       title = this.translate.get('EDIT');
  //       break;
  //   }

  //   // Editing a Parcel or Test
  //   if (action == "edit") {

  //     // Setting the form fields
  //     let inputsList: any;
  //     switch (itemType) {
  //       case Steps.Parcels:
  //         inputsList = [{ name: 'name', placeholder: this.translate.get('NAME'), value: this.translate.get('PARCEL') + " " }];
  //         inputsList.push({ name: 'ofag', placeholder: 'Identifiant OFAG', value: this.user.idOfag });
  //         break;
  //       case Steps.Tests:
  //         inputsList = [{ name: 'name', placeholder: this.translate.get('NAME'), value: 'Test ' }];
  //         inputsList.push({ name: 'date', placeholder: this.translate.get('DATE'), value: Utils.getCurrentDatetime('dd/MM/y') });
  //         break;
  //     }
  //     let prompt = this.alertCtrl.create({
  //       title: title,
  //       inputs: inputsList,
  //       buttons: [
  //         {
  //           text: this.translate.get('CANCEL'),
  //         },
  //         {
  //           text: this.translate.get('VALIDATE'),
  //           handler: data => {

  //             if (action == "edit") {
  //               let index = this.parcels.indexOf(item);
  //               let parcel = this.parcels[index];

  //               if (index > -1) {
  //                 parcel.name = data['name'];
  //                 this.dataService.save("parcels", this.parcels);
  //               }
  //             }
  //           }
  //         }
  //       ]
  //     });
  //     prompt.present();
  //   }
  // }

  protected deleteItem(event, item: Test | Parcel) {
    event.stopPropagation();
    switch (this.navigationStep) {
      case ParcelTestNavigationStep.Parcels:
        this.dataService.deleteParcel(item as Parcel);
        break;
      case ParcelTestNavigationStep.Tests:
        this.dataService.deleteTest(item as Test);
        this.listItems = this.currentParcel.tests.filter(
          test => test.isCompleted === this.isConsultation
        );
        break;
    }
    this.dataService.saveParcels();
  }

  protected itemClicked(item) {
    switch (this.navigationStep) {
      case ParcelTestNavigationStep.Parcels:
        let selectedParcel = (item as Parcel);
        this.dataService.setCurrentParcel(selectedParcel.id);
        if (this.isConsultation) {
          this.navCtrl.push(ParcelsTestsPage, {
            isConsultation: this.isConsultation,
            step: ParcelTestNavigationStep.Tests
          });
        } else {
          let testId = selectedParcel.tests.length > 0
            ? selectedParcel.tests[selectedParcel.tests.length - 1].id + 1
            : 1;
          let currentParcel = this.dataService.getCurrentParcel()
          let test = new Test({
            id: testId,
            name: this.translate.get("TEST") + " " + testId,
            date: Utils.getCurrentDatetime("dd/MM/y - HH:mm"),
            step: Steps.EXTRACTING_BLOCK,
            parcel: {num: currentParcel.ofag, name: currentParcel.name },
            isUploaded: false
          });
          let parcelIndex = this.parcels.indexOf(currentParcel);
          this.parcels[parcelIndex].tests.push(test);
          this.dataService.setCurrentTest(test.id);
          this.dataService.saveParcels();
          this.navCtrl.push(GifViewPage);
        }
        break;
      case ParcelTestNavigationStep.Tests:
        if (this.isConsultation) {
          this.showSummary(item);
        }
    }
  }

  private showSummary(test: Test) {
    this.modalCtrl
      .create(ModalPicturePage, { type: "resume", resume: test })
      .present();
  }

  protected switchEditMode() {
    if (this.editMode) {
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }
}
