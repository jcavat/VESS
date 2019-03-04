import { ModalPicturePage } from './../modal-picture/modal-picture';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
// Providers
import { TranslateProvider } from './../../providers/translate/translate';

/**
 * Structural quality view. Shows criterias for each
 * score from SQ1 to SQ5.
 */
@Component({
  selector: 'page-structural-quality',
  templateUrl: 'structural-quality.html',
})
export class StructuralQualityPage {
  private photos: any[] = [{ url: 'assets/pictures/structural_quality.jpg' }];
  public items: Array<{
    quality: string, 
    qualityTxt: string, 
    sizeAppearance: string, 
    porosity: String,
    appearance1: string, 
    appearance2: string, 
    distinctiveFeaturesImg: string, 
    distrinctiveFeatureTxt: string,
    aggreagatesImg: string,
    aggreagatesShatteredImg: string,
    aggreagatesTxt: string, 
    color: string
  }>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private modalCtrl: ModalController,
    private translate: TranslateProvider) {
  }

  ionViewDidLoad() {

    this.items = [
      {
        quality: this.translate.get('SQ1.QUALITY'),
        qualityTxt: this.translate.get('SQ1.QUALITY_DESCRIPTION'),
        sizeAppearance: this.translate.get('SQ1.SIZE_AND_APPEARANCE'),
        porosity: this.translate.get('SQ1.POROSITY_AND_ROOTS'),
        appearance1: "./assets/pictures/Sq1_bloc_entier_Deluz.jpg",
        appearance2: "./assets/pictures/pas_motte_fermee.png",
        distinctiveFeaturesImg: "./assets/pictures/F4_trait_distinctif_Sq1_agregats_ronds_fins_et_poreux.JPG",
        distrinctiveFeatureTxt: this.translate.get('SQ1.DISTINGUISHING_FEATURE'),
        aggreagatesImg: "./assets/pictures/sq1_1cm_avec_echelle.jpg",
        aggreagatesShatteredImg: undefined,
        aggreagatesTxt: this.translate.get('SQ1.APPEARANCE_OF_FRAGMENT'),
        color: "sq1"
      },
      {
        quality: this.translate.get('SQ2.QUALITY'),
        qualityTxt: this.translate.get('SQ2.QUALITY_DESCRIPTION'),
        sizeAppearance: this.translate.get('SQ2.SIZE_AND_APPEARANCE'),
        porosity: this.translate.get('SQ2.POROSITY_AND_ROOTS'),
        appearance1: "./assets/pictures/D5_Sq2_bloc_apres_extraction2.JPG",
        appearance2: "./assets/pictures/pas_motte_fermee.png",
        distinctiveFeaturesImg: "./assets/pictures/D10_trait_distinctif_Sq2__forte_porosite.JPG",
        distrinctiveFeatureTxt: this.translate.get('SQ2.DISTINGUISHING_FEATURE'),
        aggreagatesImg: "./assets/pictures/Sq2__agregat_seul_3.JPG",
        aggreagatesShatteredImg: "./assets/pictures/Sq2_agregat1.JPG",
        aggreagatesTxt: this.translate.get('SQ2.APPEARANCE_OF_FRAGMENT'),
        color: "sq2"
      },
      {
        quality: this.translate.get('SQ3.QUALITY'),
        qualityTxt: this.translate.get('SQ3.QUALITY_DESCRIPTION'),
        sizeAppearance: this.translate.get('SQ3.SIZE_AND_APPEARANCE'),
        porosity: this.translate.get('SQ3.POROSITY_AND_ROOTS'),
        appearance1: "./assets/pictures/Sq3_bloc_apres_extraction_2.JPG",
        appearance2: "./assets/pictures/pas_motte_fermee.png",
        distinctiveFeaturesImg: "./assets/pictures/trait_distinctif_Sq3_faible_porosite_2.JPG",
        distrinctiveFeatureTxt: this.translate.get('SQ3.DISTINGUISHING_FEATURE'),
        aggreagatesImg: "./assets/pictures/Sq3_agregat_cropped.jpg",
        aggreagatesShatteredImg: "./assets/pictures/trait_distictif_Sq3__faible_porosite.JPG",
        aggreagatesTxt: this.translate.get('SQ3.APPEARANCE_OF_FRAGMENT'),
        color: "sq3"
      },
      {
        quality: this.translate.get('SQ4.QUALITY'),
        qualityTxt: this.translate.get('SQ4.QUALITY_DESCRIPTION'),
        sizeAppearance: this.translate.get('SQ4.SIZE_AND_APPEARANCE'),
        porosity: this.translate.get('SQ4.POROSITY_AND_ROOTS'),
        appearance1: "./assets/pictures/Sq4_bloc_apres_extraction_2.JPG",
        appearance2: "./assets/pictures/pas_motte_fermee.png",
        distinctiveFeaturesImg: "./assets/pictures/trait_distinctif_Sq4__racine_dans_macropore.JPG",
        distrinctiveFeatureTxt: this.translate.get('SQ4.DISTINGUISHING_FEATURE'),
        aggreagatesImg: "./assets/pictures/Sq4_motte_fermee.JPG",
        aggreagatesShatteredImg: "./assets/pictures/Sq4_motte_brisee.JPG",
        aggreagatesTxt: this.translate.get('SQ4.APPEARANCE_OF_FRAGMENT'),
        color: "sq4"
      },
      {
        quality: this.translate.get('SQ5.QUALITY'),
        qualityTxt: this.translate.get('SQ5.QUALITY_DESCRIPTION'),
        sizeAppearance: this.translate.get('SQ5.SIZE_AND_APPEARANCE'),
        porosity: this.translate.get('SQ5.POROSITY_AND_ROOTS'),
        appearance1: "./assets/pictures/D15_Sq5_bloc_apres_extraction.JPG",
        appearance2: "./assets/pictures/pas_motte_fermee.png",
        distinctiveFeaturesImg: "./assets/pictures/trait_distinctif_Sq5_anoxie.JPG",
        distrinctiveFeatureTxt: this.translate.get('SQ5.DISTINGUISHING_FEATURE'),
        aggreagatesImg: "./assets/pictures/Sq5_macropore_avec_racine_dedans.JPG",
        aggreagatesShatteredImg: "./assets/pictures/F16_Sq5_Fragment_entier_tres_anguleux.JPG",
        aggreagatesTxt: this.translate.get('SQ5.APPEARANCE_OF_FRAGMENT'),
        color: "sq5"
      }
    ];
  }

  protected openModal() {
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: this.photos,
      initialSlide: 0, // The second image
    });
    modal.present();
  }

  showModalPicture(imgSrc) {
    let pictureModal = this.modalCtrl.create(ModalPicturePage, { imgSrc: imgSrc, type: "picture" });
    pictureModal.present();
  }
}