import { Http, Headers } from '@angular/http';
import { Injectable } from '@angular/core';

// Providers
import { DataService } from '../../providers/data-service';
import { TranslateProvider } from '../../providers/translate/translate'
import { Utils } from '../../providers/utils';
import { Test } from '../../models/parcel';
import { Base64 } from '@ionic-native/base64';

/*
  Generated class for the UploadProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UploadProvider {

  readonly URL_SERVER_BASE : string = "http://129.194.186.122:8080/";
  readonly URL_SERVER_UPLOAD : string = this.URL_SERVER_BASE + 'measurement';



  constructor( public http: Http, 
              private dataService: DataService, 
              private base64: Base64) {}

  public uploadTest(test: Test){
    
    let testJSON = Object.assign({}, test);
    console.log(test);
    console.log(testJSON);

    this.uploadTestJSON(testJSON);
    
    /*
    testJSON.layers.forEach(l => {
      delete l.maxThickness;
      delete l.minThickness;
      delete l.id;
    });
    */

    //delete testJSON.user.idOfag;
    //delete testJSON.user.language;

  }

  private encodePath(path): Promise<String> {
    return new Promise<String>((resolve, error) => {
    var c = document.createElement('canvas');
		var ctx = c.getContext("2d");
		var img = new Image();
		img.onload = function() {
			c.width = 1280;
			c.height = 720;

			ctx.drawImage(img, 0, 0);
      let split = path.split(".");
      let fileType = split[split.length -1];
			var dataUri = c.toDataURL("image/"+fileType);
			
			resolve(dataUri);
		};
    img.src = path;
  });
  }

  private uploadTestJSON(testJSON){

    

    if (!testJSON.comment) testJSON.comment = "";
    if (!testJSON.geolocation) testJSON.geolocation = {longitude: -1, latitude: -1};
    if (!testJSON.user.farmerID) testJSON.user.farmerID = "";

    let promiseBlockEncoded = undefined;
    if(testJSON.picture) {
      let path = Utils.getPathForImage(this.dataService.getLocalDirectory(), testJSON.picture); // Add block picture if existing
      //promiseBlockEncoded = this.base64.encodeFile(path);
      promiseBlockEncoded = this.encodePath(path);
      /*.then(
        (base64File) => {
          testJSON.encodedImage = base64File;
          isBlockPictureEncoded = true
        },
        (err) => {
          console.log(err);
          isBlockPictureEncoded = true
        });*/
    } else {
      testJSON.encodedImage = "";
      promiseBlockEncoded = "";
    }

    let promiseLayersEncoded = []
    for (let layer of testJSON.layers) { // Add existing layers pictures
      if(layer.picture){ 
        let path = Utils.getPathForImage(this.dataService.getLocalDirectory(), layer.picture); // Add block picture if existing
        //promiseLayersEncoded[layer.num] = this.base64.encodeFile(path);
        promiseLayersEncoded[layer.num] = this.encodePath(path);
        /*.then(
          (base64File) => {
            layer.encodedImage = base64File;
            layerPictureEncoded[layer.num] = true
          },
          (err) => {
            console.log(err);
            layerPictureEncoded[layer.num] = true
          });
          */
      } else {
        layer.encodedImage = "";
        promiseLayersEncoded[layer.num] = "";
      }
    }

    let allLayerEncoded = Promise.all(promiseLayersEncoded);

    let req_headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization' : 'Bearer ABCD'
    });
    

    Promise.all([
      promiseBlockEncoded,

        allLayerEncoded
    ])
    .then(values => {

      let encodedBlock = values[0];
      testJSON.encodedImage = encodedBlock;
      console.log("encoded Block: ", encodedBlock);
      
      let encodedLayer = values[1];
      for (let layer of testJSON.layers ){
        layer.encodedImage = encodedLayer[layer.num];
        console.log("encoded layer n° ",layer.num," : ",layer.encodedImage);
      }

      this.http.post(this.URL_SERVER_UPLOAD,testJSON, {headers: req_headers})
      .map(res => res.json)
      .subscribe( res => {
        console.log(res);
      });
   });

  }

  public testUpload(){
    let testJSON = {
      "step": 5,
      "isCompleted": true,
      "layers": [
        {
          "num": 1,
          "thickness": 15,
          "minThickness": 0,
          "maxThickness": 15,
          "comment": "",
          "score": 3,
          "encodedImage": ""
        },
        {
          "num": 2,
          "thickness": 15,
          "minThickness": 15,
          "maxThickness": 30,
          "comment": "",
          "score": 3,
          "encodedImage": ""
        }
      ],
      "id": 9,
      "name": "Test 9",
      "date": "11/03/2019",
      "thickness": 30,
      "soilState": "NORMAL_SOIL",
      "score": 3,
      "encodedImage": "",
      "user": {
        "firstName": "fab",
        "lastName": "vit",
        "userType": "anonymous",
        "mail": "fab@moi.ch",
        "farmerID": "165846464"
      }
    };
  
    this.uploadTestJSON(testJSON);
  }

}
