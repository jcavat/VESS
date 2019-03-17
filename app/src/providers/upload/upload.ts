import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

// Providers
import { DataService } from '../../providers/data-service';
import { TranslateProvider } from '../../providers/translate/translate'
import { Utils } from '../../providers/utils';
import { Test } from '../../models/parcel';
import { LoadingController, Loading, AlertController } from 'ionic-angular';

/*
  Generated class for the UploadProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploadProvider {

  readonly URL_SERVER_BASE : string = "http://129.194.186.122:8080/";
  readonly URL_SERVER_UPLOAD : string = this.URL_SERVER_BASE + 'measurements';
  readonly AUTH_TOKEN : string = "ABCD";



  constructor( public http: Http, 
              private dataService: DataService,
              public alertCtrl: AlertController,
              private loadingController: LoadingController) {}

  public uploadTest(test: Test){
    
    const loading : Loading = this.loadingController.create({
      content: 'Uploading...',
      duration: 10000
    });

    loading.present().then(
      l => console.log()
    );

    let testJSON : any = Object.assign({}, test);

    if (!testJSON.comment) testJSON.comment = "";
    if (!testJSON.geolocation) testJSON.geolocation = {longitude: -1, latitude: -1};
    if (!testJSON.user.farmerID) testJSON.user.farmerID = "";

    let promiseBlockEncoded : Promise<String> = undefined;
    if(testJSON.picture) {
      let path = Utils.getPathForImage(this.dataService.getLocalDirectory(), testJSON.picture); // Add block picture if existing

      promiseBlockEncoded = this.encodePath(path);

    } else {
      promiseBlockEncoded = Promise.resolve("");
    }

    let promiseLayersEncoded  : Promise<String>[] = []
    for (let layer of testJSON.layers) { // Add existing layers pictures
      if(layer.picture){ 
        let path = Utils.getPathForImage(this.dataService.getLocalDirectory(), layer.picture); // Add block picture if existing
        
        promiseLayersEncoded[layer.num] = this.encodePath(path);

      } else {
        promiseLayersEncoded[layer.num] = Promise.resolve("");
      }
    }

    let allLayerEncoded : Promise<String[]> = Promise.all(promiseLayersEncoded);

    let req_headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization' : 'Bearer ' + this.AUTH_TOKEN
    });
    

    // Only when all the pictures are encoded we send the data, hence the Promise.all()
    Promise.all([
      promiseBlockEncoded,
      allLayerEncoded
    ])
    .then(values => {

      let encodedBlock = values[0];
      testJSON.encodedImage = encodedBlock;
      console.log("encoded Block: OK");
      
      let encodedLayers = values[1];
      for (let layer of testJSON.layers ){
        layer.encodedImage = encodedLayers[layer.num];
        console.log("encoded layer n° ",layer.num," OK");
      }

      this.http.post(this.URL_SERVER_UPLOAD,testJSON, {headers: req_headers})
      .map(res => res.json)
      .subscribe( 
        res => {
          test.isUploaded = true;
          this.dataService.saveParcels();
          loading.dismissAll();
          this.showAlert("Upload successful.","",["OK"]);
          
        },
        err => {
          loading.dismissAll();
          this.showAlert("Upload successful.",err,["OK"]);
        }
      );
   });

  }

  private encodePath(path : string): Promise<String> {
    return new Promise<String>((resolve, error) => {
      var c = document.createElement('canvas');
      var ctx = c.getContext("2d");
      var img = new Image();
      img.onload = function() {
        c.width = 1280;
        c.height = 720;

        ctx.drawImage(img, 0, 0);

        var dataUri = c.toDataURL("image/jpg");
        
        resolve(dataUri);
      };
      img.onerror = function(){
        console.log("Couldn't upload an image")
        resolve("");
      };

      img.src = path;
    });
  }

  showAlert(Title, subTitle, buttons) {
    let alert = this.alertCtrl.create({
      title: Title,
      subTitle: subTitle,
      buttons: buttons
    });
    alert.present();
  }

}
