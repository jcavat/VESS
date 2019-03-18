import { TutorialPage } from './../pages/tutorial/tutorial';
import { AboutPage } from './../pages/about/about';
import { NgModule } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { IonicApp, IonicModule } from 'ionic-angular';
import { BrowserModule } from '@angular/platform-browser';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Http, HttpModule } from '@angular/http';

import { MyApp } from './app.component';

// Ionic Native plugins
import { Camera } from '@ionic-native/camera';
import { Diagnostic } from '@ionic-native/diagnostic';
import { EmailComposer } from '@ionic-native/email-composer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Geolocation } from '@ionic-native/geolocation';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '@ionic-native/toast';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Network } from '@ionic-native/network';
import { LocationAccuracy } from '@ionic-native/location-accuracy'

// Pages
import { CameraPage } from '../pages/camera/camera';
import { DefiningLayerPage } from '../pages/defining-layer/defining-layer';
import { ExportPage } from './../pages/export/export';
import { GifViewPage } from '../pages/gif-view/gif-view';
import { GlossaryPage } from '../pages/glossary/glossary';
import { GlossaryDefinitionPage } from '../pages/glossary-definition/glossary-definition';
import { HomePage } from '../pages/home-page/home-page';
import { ModalPicturePage } from '../pages/modal-picture/modal-picture';
import { Notation1Page } from '../pages/notation-1/notation-1';
import { Notation2Page } from '../pages/notation-2/notation-2';
import { ParcelsTestsPage } from '../pages/parcels-tests/parcels-tests';
import { VerifNotationPage } from '../pages/verif-notation/verif-notation';
import { SettingsPage } from '../pages/settings/settings';
import { StructuralQualityPage } from './../pages/structural-quality/structural-quality';

// Providers
import { DataService } from '../providers/data-service';
import { RulerService } from '../providers/ruler-service';
import { UploadProvider } from '../providers/upload/upload';
import { Toasts } from '../providers/toasts';
import { Utils } from '../providers/utils';
import { GalleryModal } from 'ionic-gallery-modal';
import { ZoomableImage } from 'ionic-gallery-modal';
import { GpsServiceProvider } from '../providers/gps-service/gps-service';

// Component
import { FooterComponent } from '../components/footer/footer';
import { HelpComponent } from '../components/help/help';
import { SlidePictureComponent } from '../components/slide-picture/slide-picture';
import { ResumeComponent } from '../components/resume/resume';
import { TranslateProvider, CustomTranslatePipe } from '../providers/translate/translate';
import 'intl';
import 'intl/locale-data/jsonp/en';

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AboutPage,
    CameraPage,
    DefiningLayerPage,
    GifViewPage,
    GlossaryPage,
    GlossaryDefinitionPage,
    ExportPage,
    HomePage,
    ModalPicturePage,
    Notation1Page,
    MyApp,
    Notation2Page,
    ParcelsTestsPage,
    VerifNotationPage,
    FooterComponent,
    HelpComponent,
    SlidePictureComponent,
    ResumeComponent,
    SettingsPage,
    StructuralQualityPage,
    TutorialPage,

    GalleryModal,
    ZoomableImage,
    CustomTranslatePipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [Http]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AboutPage,
    CameraPage,
    DefiningLayerPage,
    ExportPage,
    GifViewPage,
    GlossaryPage,
    GlossaryDefinitionPage,
    HomePage,
    ModalPicturePage,
    MyApp,
    Notation1Page,
    Notation2Page,
    ParcelsTestsPage,
    VerifNotationPage,
    FooterComponent,
    HelpComponent,
    SlidePictureComponent,
    ResumeComponent,
    SettingsPage,
    StructuralQualityPage,
    TutorialPage,

    GalleryModal
  ],
  providers: [
    InAppBrowser,
    BackgroundMode,
    Camera,
    DataService,
    Diagnostic,
    EmailComposer,
    File,
    FilePath,
    Geolocation,
    Network,
    GpsServiceProvider,
    LocationAccuracy,
    RulerService,
    ScreenOrientation,
    SplashScreen,
    StatusBar,
    Toast,
    Toasts,
    Utils,
    TranslateProvider,
    UploadProvider
  ]
})

export class AppModule { }
