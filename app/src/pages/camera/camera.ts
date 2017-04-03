import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Camera, File, Toast } from 'ionic-native';
// Pages
import { DefiningLayerPage } from '../defining-layer/defining-layer';
import { Notation1Page } from '../notation-1/notation-1';

declare var cordova;

@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html'
})
export class CameraPage {
  public imageFile: string;
  pageTitle: string;
  stepView: number;
  pathImgBlock: string = cordova.file.dataDirectory + "/imgBlock";
  imageNamePath: string;
  dirName: string;
  description : string;
  defaultBlockPicture: string = "./assets/icon/two-layers-example.png";
  defaultLayerPicture: string = "./assets/icon/generic-image.png";

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.stepView = this.navParams.get('stepView');


    //image in function of step
    switch (this.stepView) {
      case 1:
        this.pageTitle = "Photo du bloc entier";
        this.dirName = "imgBlock";
        this.imageNamePath = "imgBlock/newImgBlock.jpg";
        this.imageFile = this.defaultBlockPicture;
        this.description = "Prenez une photo montrant le bloc entier et ses différentes couches, ainsi que le trou dont il est extrait :";
        break;
      case 5:
        this.pageTitle = "Photo de la couche";
        this.dirName = "imgLayer";
        this.imageNamePath = "imgBlock/newImgLayer.jpg";
        this.imageFile = this.defaultLayerPicture;
        this.description = "Prenez une photo de la couche :";
        break;
    }
  }

  takePicture() {
    Camera.getPicture({
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: 1000, //TODO: check if it necessary to resize picture, and if so, set correct values
      targetHeight: 1000,
      correctOrientation: true
    }).then((imagePath) => {
      //read new image
      this.imageFile = "data:image/jpeg;base64," + imagePath;
      //check if directory exist
      File.checkDir(cordova.file.dataDirectory, this.dirName).then(success => {
        //Directory is already created, so write imgFile
        File.writeFile(cordova.file.dataDirectory, this.imageNamePath, imagePath, true)
      }, error => {
        //Directory is not created, so you have to create it
        File.createDir(cordova.file.dataDirectory, this.dirName, true).then(success => {
          //Directory is created, so you have to create image file
          File.writeFile(cordova.file.dataDirectory, this.imageNamePath, imagePath, true);
        }, error => {
          Toast.show("Error when created directory", "long", "bottom").subscribe(toast => { console.log(toast); });
        });
      });

    }, (err) => {
      Toast.show("Error picture", "long", "bottom").subscribe(toast => { console.log(toast); });
    });
  }


  validationStep() {
    switch (this.stepView) {
      case 1:
        if (this.imageFile != this.defaultBlockPicture) {
          this.navCtrl.push(DefiningLayerPage, {
            stepView: this.stepView + 1,
            picture: this.imageFile
          })
        } else {
          Toast.show("Veuillez prendre une photo", "long", "bottom").subscribe(toast => { console.log(toast); });
        }
        break;
      case 5:
        if (this.imageFile != this.defaultLayerPicture) {
          this.navCtrl.push(Notation1Page)
        } else {
          Toast.show("Veuillez prendre une photo", "long", "bottom").subscribe(toast => { console.log(toast); });
        }
        break;
    }
  }
}
