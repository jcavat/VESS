import { Layer, Test, Steps } from './../../models/parcel';
import { User } from '../../models/user';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform, AlertController } from 'ionic-angular';
// Pages
import { ModalPicturePage } from '../modal-picture/modal-picture';
import { Notation1Page } from '../notation-1/notation-1';
import { CameraPage } from '../camera/camera';
// Providers
import { DataService } from '../../providers/data-service';
import { RulerService } from '../../providers/ruler-service';
import { Toasts } from '../../providers/toasts';
import { TranslateProvider } from '../../providers/translate/translate'
import { Utils } from './../../providers/utils';
import { UploadProvider } from '../../providers/upload/upload';

/**
 * Validation of the layer notation. User must check multiples criterias.
 * Depending of the number of validated criteras:
 * - Enough are validated: score is given,
 * - Only a few are checked: ask the user if he's sure, or wants to redo
 *   the layer notation,
 * - No critera is validated: the user must redo the layer notation.
 */
@Component({
  selector: 'page-verif-notation',
  templateUrl: 'verif-notation.html'
})
export class VerifNotationPage {
  heightRuler: number;
  score: number;
  private helpId: string;
  items: Array<{ title: string, checked: boolean, imgSrc?: string, code: number }>;
  criterias: Array<{ title: string, array: Array<{ title: string, checked: boolean, imgSrc?: string, code: number }> }>;
  private currentLayer: Layer;
  private currentTest: Test;
  private nextLayerIndex: number;
  public title: string;
  public layerNumber: number;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private dataService: DataService,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private platform: Platform,
    public rulerService: RulerService,
    private toasts: Toasts,
    private translate: TranslateProvider,
    private uploadProvider: UploadProvider) { }

  ionViewDidLoad() {
    this.currentLayer = this.dataService.getCurrentLayer();
    this.currentTest = this.dataService.getCurrentTest();
    this.currentLayer.comment = "";
    this.layerNumber = this.currentLayer.num;
    this.title = this.translate.get('NOTATION_VERIFICATION') + " " + this.layerNumber + "  (" + this.currentLayer.minThickness + "-" + this.currentLayer.maxThickness + " cm)";
    this.nextLayerIndex = this.currentTest.layers.indexOf(this.currentLayer) + 1;

    if (!this.platform.is('core')) {
      this.rulerService.getHeightStyle(846, 56).then((value: number) => {
        this.heightRuler = value;
      }).catch((error: string) => {
        this.toasts.showToast(error);
      });
    }

    if (this.navParams.get('score') != null) {
      this.score = this.navParams.get('score');

      switch (this.score) {

        case 1: // No closed clods; < 1cm
          this.items = [
            {
              title: this.translate.get('VERIF_SCORE1_CRITERIA1_CHECK1'),
              checked: false,
              imgSrc: './assets/pictures/sq2_1cm.jpg',
              code: 1
            },
            {
              title: this.translate.get('VERIF_SCORE1_CRITERIA1_CHECK2'),
              checked: false,
              imgSrc: './assets/pictures/sq2_1cm.jpg',
              code: 2
            },
            {
              title: this.translate.get('VERIF_SCORE1_CRITERIA1_CHECK3'),
              checked: false,
              imgSrc: './assets/pictures/F4_trait_distinctif_Sq1_agregats_ronds_fins_et_poreux.JPG',
              code: 3
            }
          ];
          this.criterias = [{ title: this.translate.get('VERIF_SCORE1_CRITERIA1_TITLE'), array: this.items }];
          this.helpId = "help_verif_score1";
          break;

        case 2: // No closed clods; up to 7cm
          this.items = [
            {
              title: this.translate.get('VERIF_SCORE2_CRITERIA1_CHECK1'),
              checked: false,
              imgSrc: './assets/pictures/D8_Sq2__forte_porosite_intra_agregat.JPG',
              code: 1
            },
            {
              title: this.translate.get('VERIF_SCORE2_CRITERIA1_CHECK2'),
              checked: false,
              imgSrc: './assets/pictures/sq2_1cm.jpg',
              code: 2
            },
            {
              title: this.translate.get('VERIF_SCORE2_CRITERIA1_CHECK3'),
              checked: false,
              imgSrc: './assets/pictures/F7_agegats_arrondis_et_poreux_maintenus_par_des_racines.jpg',
              code: 3
            }
          ];
          this.criterias = [{ title: this.translate.get('VERIF_SCORE2_CRITERIA1_TITLE'), array: this.items }];
          this.helpId = "help_verif_score2";
          break;

        case 3:
          this.items = [
            {
              title: this.translate.get('VERIF_SCORE3_CRITERIA1_CHECK1'),
              checked: false,
              imgSrc: './assets/pictures/D8_Sq2__forte_porosite_intra_agregat.JPG',
              code: 1
            },
            {
              title: this.translate.get('VERIF_SCORE3_CRITERIA1_CHECK2'),
              checked: false,
              imgSrc: './assets/pictures/no_picture.png',
              code: 2
            },
            {
              title: this.translate.get('VERIF_SCORE3_CRITERIA1_CHECK3'),
              checked: false,
              imgSrc: './assets/pictures/D10_trait_distinctif_Sq2__forte_porosite.JPG',
              code: 3
            }
          ];
          this.criterias = [{ title: this.translate.get('VERIF_SCORE3_CRITERIA1_TITLE'), array: this.items }];
          this.criterias.push({
            title: this.translate.get('VERIF_SCORE3_CRITERIA2_TITLE'),
            array: [{ title: this.translate.get('YES'), checked: false, imgSrc: './assets/pictures/D11_Sq4_fragment_brise2.JPG', code: 1 }]
          });
          this.helpId = "help_verif_score3";
          break;

        case 4: // Majority of closed clods; less than 30% of aggregates...
          this.items = [
            {
              title: this.translate.get('VERIF_SCORE4_CRITERIA1_CHECK1'),
              checked: false, imgSrc: './assets/pictures/F12.JPG',
              code: 1
            },
            {
              title: this.translate.get('VERIF_SCORE4_CRITERIA1_CHECK2'),
              checked: false,
              imgSrc: './assets/pictures/D11_Sq4_fragment_brise2.JPG',
              code: 2
            }
          ];
          this.criterias = [{ title: this.translate.get('VERIF_SCORE4_CRITERIA1_TITLE'), array: this.items }];
          this.criterias.push({ title: this.translate.get('VERIF_SCORE4_CRITERIA2_TITLE'), array: [{ title: 'Oui', checked: false, imgSrc: './assets/pictures/F14_Sq5_racines_en_arretes_de_poisson.JPG', code: 1 }] });
          this.helpId = "help_verif_score4";
          break;
        case 5: // Majority of closed clods; almost no aggregates smaller than 7 cm
          this.items = [
            {
              title: this.translate.get('VERIF_SCORE5_CRITERIA1_CHECK1'),
              checked: false,
              imgSrc: './assets/pictures/fragment_1cm.jpg',
              code: 1
            },
            {
              title: this.translate.get('VERIF_SCORE5_CRITERIA1_CHECK2'),
              checked: false,
              imgSrc: './assets/pictures/F16_Sq5_Fragment_entier_tres_anguleux.JPG',
              code: 2
            }
          ];
          this.criterias = [{ title: this.translate.get('VERIF_SCORE5_CRITERIA1_TITLE'), array: this.items }];
          this.criterias.push({
            title: this.translate.get('VERIF_SCORE5_CRITERIA2_TITLE'),
            array: [{ title: this.translate.get('YES'), checked: false, imgSrc: './assets/pictures/F14_Sq5_racines_en_arretes_de_poisson.JPG', code: 1 }]
          });
          this.criterias.push({
            title: this.translate.get('VERIF_SCORE5_CRITERIA3_TITLE'),
            array: [{ title: this.translate.get('YES'), checked: false, imgSrc: './assets/pictures/anoxie.jpg', code: 1 }]
          });
          this.helpId = "help_verif_score5";
          break;
      }
    }
  }

  showModal(imgSrc) {
    let testModal = this.modalCtrl.create(ModalPicturePage, { imgSrc: imgSrc, type: "picture" });
    testModal.present();
  }

  showAlert(Title, subTitle, buttons) {
    let alert = this.alertCtrl.create({
      title: Title,
      subTitle: subTitle,
      buttons: buttons
    });
    alert.present();
  }


  validationStep() {
    //cnt nb check and nb criteria
    let cntCriteria = 0;
    let cntChecked = 0;
    for (let criteria of this.criterias) {
      for (let item of criteria.array) {
        cntCriteria += 1;
        if (item.checked == true) {
          cntChecked += 1;
        }
      }
    }

    // Handle specific case of SQ3 score
    if(this.score == 3) {
      let hasPositiveCrit = this.criterias[0].array.some(criteria => criteria.checked);
      let hasNegativeCrit = this.criterias[1].array.some(criteria => criteria.checked);

      // SQ3 should have at least 1 positive criteria AND at least 1 negative criteria checked
      if(hasPositiveCrit && hasNegativeCrit) {
        this.showAlert(this.translate.get('VALIDATION'),
        this.translate.get('VALIDATION_ENOUGH_VALID_CRITERIA', { score: this.score }),
        ['OK']);
        this.goToNextLayerOrHome();
      }
      else{
        let alertTitle = "";
        let alertText = "";
        if (hasPositiveCrit && !hasNegativeCrit){
          alertTitle = this.translate.get('VALIDATION_INCORRECT_CRITERIAS');
          alertText = this.translate.get('VALIDATION_NO_NEGATIVE_CRITERIA')
        } else {
          alertTitle = this.translate.get('VALIDATION_INCORRECT_CRITERIAS');
          alertText = this.translate.get('VALIDATION_NOT_ENOUGH_CRITERIA');
        }

        this.showAlert(alertTitle, alertText, ['OK']);
        this.navCtrl.push(Notation1Page);
      }
    }
    else { // if score is not 3

      //Condition of criteria
      if (((cntChecked >= 2) && (cntCriteria == 3)) || ((cntChecked >= 3) && (cntCriteria == 4))) {//Notation ok
        this.showAlert(this.translate.get('VALIDATION'),
          this.translate.get('VALIDATION_ENOUGH_VALID_CRITERIA', { score: this.score }),
          ['OK']);
        this.goToNextLayerOrHome();
      } else if (cntChecked == 0) {//Return to decision tree on wrong result
        this.showAlert(this.translate.get('NO_VALIDATED_CRITERIA'),
          this.translate.get('VALIDATION_NO_VALID_CRITERIA'),
          ['OK']);
        this.navCtrl.push(Notation1Page);
      } else {//suggest to return to decision tree or valid notation
        this.showAlert(this.translate.get('VALIDATION'), this.translate.get('VALIDATION_FEW_VALID_CRITERIA', { score: this.score }), [
          {
            text: this.translate.get('NO_REDO_NOTATION'),
            handler: data => {
              this.navCtrl.push(Notation1Page);
            }
          },
          {
            text: this.translate.get('YES'),
            handler: data => {
              this.goToNextLayerOrHome();
            }
          }]);
      }
    }
  }

  // TODO: Add modal, or alert (see above) showing score
  private goToNextLayerOrHome() {
    this.currentLayer.score = this.score;
    this.dataService.saveParcels();

    if (this.nextLayerIndex < this.currentTest.layers.length) {
      this.dataService.setCurrentLayer(this.nextLayerIndex);
      if (!this.platform.is('core')) { // Check that we aren't running on desktop
      this.currentTest.step = Steps.PICTURE_LAYER;
        this.navCtrl.push(CameraPage);
      }
      else {
        this.currentTest.step = Steps.NOTATION;
        this.navCtrl.push(Notation1Page);
      }
    } else {
      this.calculateAndShowTestScore();
    }
  }

  private calculateAndShowTestScore() {

    //indicative score
    let testScoreIndicatif = 0
    switch (this.currentTest.soilState) {
      case "STONY_SOIL": 
        testScoreIndicatif = this.calcTestScore()
        this.currentTest.comment = this.translate.get("SCORE_INDICATIVE") + ": " + testScoreIndicatif + " " +this.currentTest.comment;
        this.currentTest.layers.push({
          num: this.currentLayer.num + 1, thickness: 30 - this.currentTest.thickness, score: 3,
          comment: this.translate.get('STONY_SOIL'), minThickness: this.currentLayer.minThickness + this.currentLayer.thickness, maxThickness: 30
        })
        break;
      case "TOO_HARD_SOIL":
        testScoreIndicatif = this.calcTestScore()
        this.currentTest.comment =  this.translate.get("SCORE_INDICATIVE") + ": " + testScoreIndicatif + " " +this.currentTest.comment;
        this.currentTest.layers.push({
          num: this.currentLayer.num + 1, thickness: 30 - this.currentTest.thickness, score: 5,
          comment: this.translate.get('TOO_HARD_SOIL'), minThickness: this.currentLayer.minThickness + this.currentLayer.thickness, maxThickness: 30
        })
        break;
    }

    let testScore = this.calcTestScore()


    this.dataService.getUserInfo().then((value) => {
      if (value != null) {
        // We copy the user info so they can't be changed later
        this.currentTest.user = new User(value); 
        this.currentTest.isCompleted = true;
        this.currentTest.score = testScore;
        this.dataService.saveParcels();
        this.uploadProvider.uploadTest(this.currentTest);

        //show resume
        this.modalCtrl.create(ModalPicturePage, { type: "resume", resume: this.currentTest }).present();
      }
    });
    

    //go to the home view
    this.navCtrl.popToRoot();
  }

  calcTestScore() {
    let score = 0;
    let blockThickness = this.currentTest.layers[this.currentTest.layers.length - 1].maxThickness;
    for (let i = 0; i < this.currentTest.layers.length; i++) {
      let layer = this.currentTest.layers[i];
      score += (layer.score * layer.thickness) / blockThickness;
    }
    score = Utils.round(score, 1);
    return score;
  }

  addLayerComment() {
    let alert = this.alertCtrl.create({
      title: this.translate.get('COMMENT'),
      message: this.translate.get('COMMENT_BLOCK'),
      inputs: [
        {
          name: 'comment',
          placeholder: this.translate.get('COMMENT'),
          type: 'text'
        }]
      ,
      buttons: [
        {
          text: this.translate.get('CANCEL'),
          role: 'cancel',
          handler: data => {}
        },
        {
          text: this.translate.get('ADD'),
          handler: data => {
            this.currentLayer.comment = data.comment;
            this.dataService.saveParcels();
          }
        }
      ]
    });
    alert.present();
  }
}
