import { FilePath } from '@ionic-native/file-path';
import { Geoloc } from './../../models/geoloc';
import { Test, Layer, Steps } from './../../models/parcel';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Platform } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';

// Pages
import { Notation1Page } from '../notation-1/notation-1';
import { DefiningLayerPage } from "../defining-layer/defining-layer";
// Providers
import { DataService } from './../../providers/data-service';
import { Toasts } from './../../providers/toasts';
import { TranslateProvider } from '../../providers/translate/translate'
import { Utils } from './../../providers/utils';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy'

declare var cordova;

13/**
 * Camera view. Used to take the picture of:
 * - Extracted block,
 * - Layers.
 */
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html'
})
export class CameraPage {
  public imageFile: string;

  public lastImage: string;
  private lastImageFileName: string;
  private isOfagUser: boolean = false;
  private currentTest: Test;
  public layerNumber: number;
  private currentLayer: Layer;
  private testStep: Steps;
  title: string;
  imageNamePath: string;
  instructions: string;
  defaultImage: string;

  constructor(
    private camera: Camera,
    public alertCtrl: AlertController,
    private dataService: DataService,
    private file: File,
    private filePath: FilePath,
    public navCtrl: NavController,
    public navParams: NavParams,
    public platform: Platform,
    public  utils: Utils,
    private toasts: Toasts,
    private translate: TranslateProvider,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy) {}

    ionViewDidLoad() {

      this.locationAccuracy.canRequest().then((canRequest: boolean) => {

        if(canRequest) {
          
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_BALANCED_POWER_ACCURACY).then(
            () => console.log('Request successful'),
            error => console.log('Error requesting location permissions', error)
          );
        }
      });

    this.currentTest = this.dataService.getCurrentTest();
    this.testStep = this.currentTest.step;

    let existingPicture = "";
    switch (this.testStep) {
      case Steps.PICTURE_EXTRACTED_BLOCK:
        this.currentTest.comment = "";
        this.title = this.translate.get('PICTURE_OF_WHOLE_BLOCK');
        existingPicture = this.currentTest.picture;
        this.defaultImage = "./assets/pictures/ex_tb.jpg";
        this.instructions = this.translate.get('PICTURE_OF_WHOLE_BLOCK_INSTRUCTIONS');
        break;
      case Steps.PICTURE_LAYER:
        this.currentLayer = this.dataService.getCurrentLayer();
        this.layerNumber = this.currentLayer.num;

        this.title = this.translate.get('PICTURE_OF_LAYER') + " " + this.layerNumber + "  (" + this.currentLayer.minThickness + "-" + this.currentLayer.maxThickness + " cm)";
        existingPicture = this.dataService.getCurrentLayer().picture;
        this.defaultImage = "./assets/icon/generic-image.png";
        this.instructions = this.translate.get('PICTURE_OF_LAYER_INSTRUCTIONS');
        break;
    }
    this.lastImage = existingPicture ? existingPicture : this.defaultImage;
    }

  takePicture() {
    const options = {
      quality: 80,
      targetWidth: 1000,
      targetHeight: 1000,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true // Fix the 90° picture rotation on Android devices. Note that when using the front camera, pictures are usally vertically flipped.
    }
    this.camera.getPicture(options).then((imagePath) => {
      let currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      let correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
      this.copyFileToLocalDir(correctPath, currentName, this.dataService.getLocalDirectory() , Utils.getDatetimeFilename('.jpg'));
    }, (error) => {
      this.toasts.showToast(this.translate.get('ERROR_CREATING_PICTURE'));
    });
  }

  /**
   * Copy a file to the specified local directory of the device.
   * @param namePath Path of the file to copy.
   * @param currentName Name of the file to copy.
   * @param directory Local directory where to copy the file.  
   * See https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-file/#where-to-store-files for a list of valid locations depending of the platform.
   * @param newFileName New name of file to copy to (leave blank to remain the same).
   */
  private copyFileToLocalDir(namePath, currentName, directory, newFileName) {
    this.file.copyFile(namePath, currentName, directory, newFileName).then(
      success => { 
      this.lastImageFileName = newFileName;
      this.lastImage = Utils.getPathForImage(this.dataService.getLocalDirectory(), this.lastImageFileName);
      this.saveData(); },
      error => {
    this.toasts.showToast(this.translate.get('ERROR_SAVING_PICTURE'));
    });
  }

  private saveData(){
    switch (this.testStep) {
      case Steps.PICTURE_EXTRACTED_BLOCK:
        this.currentTest.picture = this.lastImageFileName;
        this.takeGeolocation();
        break;
      case Steps.PICTURE_LAYER:
        this.dataService.getCurrentLayer().picture = this.lastImageFileName;
        break;
    }

    this.dataService.saveParcels();

  }

  private takeGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.dataService.getCurrentTest().geolocation = new Geoloc(resp.coords);
      this.dataService.saveParcels();
    }).catch((error) => {
      console.log('Error getting location', error);
    });
  }

   /**
   * Called when the user press the "Next" button.
   * Go to the next step for the test if all requirements are met for the current step.
   */
  validationStep() {
    if (this.isOfagUser && this.imageFile == this.defaultImage) { // OFAG user must take a picture
      this.toasts.showToast(this.translate.get('PLEASE_TAKE_PICTURE'));
    } else {
      this.dataService.saveParcels();
      switch (this.testStep) {
        case Steps.PICTURE_EXTRACTED_BLOCK:
          this.currentTest.step = Steps.DEFINING_LAYERS;
          this.navCtrl.push(DefiningLayerPage);
          break;
        case Steps.PICTURE_LAYER:
          this.navCtrl.push(Notation1Page)
          break;
      }
    }
  }

  showAlert(Title, subTitle, buttons) {
    let alert = this.alertCtrl.create({
      title: Title,
      subTitle: subTitle,
      buttons: buttons
    });
    alert.present();
  }

  addTestComment() {
    let alert = this.alertCtrl.create({
      title: this.translate.get('COMMENT'),
      message: this.translate.get('COMMENT_TEST'),
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
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: this.translate.get('ADD'),
          handler: data => {
            this.currentTest.comment = data.comment;
          }
        }
      ]
    });
    alert.present();
  }
}
