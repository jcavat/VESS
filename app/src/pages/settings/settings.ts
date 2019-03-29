import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { User, UserType } from '../../models/user';
import { Storage } from '@ionic/storage';
import * as forge from "node-forge";

// Providers
import { DataService } from '../../providers/data-service';
import { Toasts } from './../../providers/toasts';
import { TranslateProvider } from '../../providers/translate/translate'

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  userType: UserType;
  firstName: string;
  lastName: string;
  mail: string
  idOfag: string;
  user: User;
  language: string;
  readonly HASH : string = "myhash";


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public dataService: DataService,
    public alertCtrl: AlertController,
    private toasts: Toasts,
    private translate: TranslateProvider) {
  }

  ionViewDidLoad() {
    this.dataService.getUserInfo().then((value) => {
      if (value != null) {
        this.user = value;

        this.firstName = this.user.firstName;
        this.lastName = this.user.lastName;
        this.userType = this.user.userType;
        this.mail = this.user.mail;
        this.idOfag = this.user.idOfag;
        this.language = this.user.language;
      } else {
        this.userType = UserType.Anonymous;
        let defaultLanguage = "fr";
        this.user = new User({ firstName: "", lastName: "", userType: this.userType, mail: "", idOfag: "", language: defaultLanguage });
        this.language = defaultLanguage;
      }
    });
  }

  showAlert(title, text) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

  saveUserInfo() {
    this.user.firstName = this.firstName;
    this.user.lastName = this.lastName;
    this.user.userType = this.userType;
    this.user.mail = this.mail;
    this.user.idOfag = this.idOfag;
    this.user.language = this.language;

    if (this.userType == UserType.Ofag && (this.idOfag == null || this.idOfag == "")) {
      this.showAlert(this.translate.get('ERROR'), this.translate.get('PLEASE_FILL_IN_OFAG_ID'));
    } else {
      this.toasts.showToast(this.translate.get('SETTINGS_SAVE'));
      this.dataService.save("user", this.user);
      this.navCtrl.pop();
    }
  }

  onLanguageChange(langSelect : HTMLSelectElement) {
    this.translate.setLang(langSelect.value);
    this.saveUserInfo();
  }

  onUserTypeChange(userTypeSelect : HTMLSelectElement) {
    let alert = this.alertCtrl.create({
      enableBackdropDismiss: false,
      title: "Mot de passe",
      inputs: [
        {
          name: "password",
          value: "",
          type: "password"
        }
      ],
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: (inputs) => {
            if(this.checkPassword(inputs.password)){
              this.dataService.save("isConnectedTV", true);
              this.toasts.showToast("Connexion réussie");
            }
            else {
              this.showAlert("Mot de passe incorrect", "");
              this.userType = UserType.Anonymous;
              userTypeSelect.value = UserType.Anonymous;
            }
          }
        }
      ]
    });
    //this.dataService.load("isConnectedTV")

    if (userTypeSelect.value === UserType.Ofag ) {
      alert.present();
    }
    
  }

  checkPassword(challenge: string){
    let hash_challenge = forge.md.sha256.create();
    hash_challenge.update(challenge);
    return hash_challenge.digest().toHex() === this.HASH;
  }
}
