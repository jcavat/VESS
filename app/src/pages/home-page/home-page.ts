import { User, UserType } from './../../models/user';
import { Component } from '@angular/core';
import { ModalController, NavController, NavParams } from 'ionic-angular';

// Pages
import { AboutPage } from './../about/about';
import { GlossaryPage } from './../glossary/glossary';
import { ParcelsTestsPage } from '../parcels-tests/parcels-tests';
import { SettingsPage } from '../settings/settings';
import { StructuralQualityPage } from './../structural-quality/structural-quality';
import { TutorialPage } from './../tutorial/tutorial';

// Providers
import { DataService } from '../../providers/data-service';
import { Toasts } from './../../providers/toasts';
import { TranslateProvider } from './../../providers/translate/translate';
import { GpsServiceProvider } from './../../providers/gps-service/gps-service'


@Component({
  selector: 'page-home-page',
  templateUrl: 'home-page.html'
})
export class HomePage {
  user: User;

  constructor(
    private dataService: DataService,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    private gpsService : GpsServiceProvider,
    private toasts: Toasts,
    private translate: TranslateProvider) {
  }

  ionViewDidLoad() {
    this.dataService.getUserInfo().then((value) => {
      if (value != null) {
        this.user = value;
        this.translate.setLang(this.user.language);
      } else {
        this.translate.setLang('fr'); // Default language (before the user sets the one s/he prefers).
      }
    });
  }

  ionViewDidEnter() {
    // Used to update the user after getting back from settings if none were existent.
    if (!this.user) {
      this.dataService.getUserInfo().then((value) => {
        if (value != null) {
          this.user = value;
          if(this.user.userType === UserType.Ofag){
            this.gpsService.askGPSPermission();
          }
        }
      });
    }
  }

  showPage(pageName: String) {
    switch (pageName) {
      case "notation":
        if (!this.user) {
          this.toasts.showToast(this.translate.get('PLEASE_SET_YOUR_USER_INFO_IN_SETTINGS_FIRST'));
        } else {
          this.navCtrl.push(ParcelsTestsPage, { isConsultation: false });
        }
        break;
      case "consultation":
        this.navCtrl.push(ParcelsTestsPage, { isConsultation: true });
        break;
      case "structural_quality":
        this.navCtrl.push(StructuralQualityPage);
        break;
      case "tutorial":
        this.navCtrl.push(TutorialPage);
        break;
      case "glossary":
        this.navCtrl.push(GlossaryPage);
        break;
      case "settings":
        this.navCtrl.push(SettingsPage);
        break;
      case "about":
        this.navCtrl.push(AboutPage);
        break;
    }
  }
}
