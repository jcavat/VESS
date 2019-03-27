
import { Injectable } from '@angular/core';
import { Platform }  from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AlertController } from 'ionic-angular';
import { TranslateProvider } from '../translate/translate'



/*
  Generated class for the GpsServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GpsServiceProvider {

  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private diagnostic: Diagnostic,
    private translate: TranslateProvider
    ) {}

  public askGPSPermission(){

    let permissionStatus = this.diagnostic.permissionStatus;

    // Check if Location service is enabled 
    this.diagnostic.getLocationAuthorizationStatus().then(
      status => {
        switch(status){
          // If Location service is not yet enabled or was previously denied, request authorization
          case permissionStatus.NOT_REQUESTED:
          case permissionStatus.DENIED:
            this.diagnostic.requestLocationAuthorization().then(
              status => {
                switch(status){
                  // If permission was not given, inform the user
                  case permissionStatus.DENIED:
                    console.log("Authorization denied");
                    this.showAlert(this.translate.get("WARNING"), 
                    this.translate.get("LOCATION_PERMISSION_DENIED"),
                      [
                        {
                          text: this.translate.get("TRY_AGAIN"),
                          handler: () => {
                            this.askGPSPermission();
                          }
                        },
                        {
                          text: this.translate.get("CANCEL"),
                          role: "cancel"
                        }
                      ]
                    );
                    break;
                  
                  case permissionStatus.DENIED_ALWAYS:
                  this.showAlert(this.translate.get("WARNING"), 
                  this.translate.get("LOCATION_PERMISSION_DENIED_ALWAYS"),
                    [
                      {
                        text: this.translate.get("CANCEL"),
                        role: "cancel"
                      },
                      {
                        text: this.translate.get("SETTINGS_OPEN"),
                        handler: () => {
                          this.diagnostic.switchToSettings();
                        }
                      }
                    ]
                  );
                  break;

                  default:
                }
              }
            );
            break;
          case permissionStatus.DENIED_ALWAYS:
            this.showAlert(this.translate.get("WARNING"), 
            this.translate.get("LOCATION_PERMISSION_DENIED_ALWAYS"),
              [
                {
                  text: this.translate.get("CANCEL"),
                  role: "cancel"
                },
                {
                  text: this.translate.get("SETTINGS_OPEN"),
                  handler: () => {
                    this.diagnostic.switchToSettings();
                  }
                }
              ]
            );
          default:
        }
      }
    )

  }

  

  private showAlert(Title, subTitle, buttons) {
    let alert = this.alertCtrl.create({
      title: Title,
      message: subTitle,
      buttons: buttons
    });
    alert.present();
  }

}
