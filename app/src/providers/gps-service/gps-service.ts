
import { Injectable } from '@angular/core';
import { Platform }  from 'ionic-angular';
import { Diagnostic } from '@ionic-native/diagnostic';
import { AlertController } from 'ionic-angular';
import { platformBrowser } from '@angular/platform-browser';



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
    private diagnostic: Diagnostic
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
                    this.showAlert("Avertissement", 
                    "Cette application a besoin de la localisation afin de fonctionner normalement.\n\
                    Appuyer sur \"Recommencer\" pour redemander les droits de localisation.",
                      [
                        {
                          text: "Recommencer",
                          handler: () => {
                            this.askGPSPermission();
                          }
                        },
                        {
                          text: "Annuler",
                          handler: () => {}
                        }
                      ]
                    );
                    break;
                  
                  case permissionStatus.DENIED_ALWAYS:
                  this.showAlert("Avertissement", 
                  "L'application n'a pas les droits nécessaires pour accèder aux services de localisation.\n\
                  Veuillez autoriser l'accès à la localisation dans les paramètres de l'appareil.",
                    [
                      "Annuler",
                      {
                        text: "Ouvrir paramètres",
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
          case permissionStatus.DENIED_ALWAYS:
            this.showAlert("Avertissement", 
            "L'application n'a pas les droits nécessaires pour accèder aux services de localisation.\n\
            Veuillez autoriser l'accès à la localisation dans les paramètres de l'appareil.",
              [
                "Annuler",
                {
                  text: "Ouvrir paramètres",
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
