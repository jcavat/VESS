import { Layer } from "./../../models/parcel";
import { Component, Input } from "@angular/core";
import { NavController } from "ionic-angular";
import { Test } from "../../models/parcel";
import { ExportPage } from "../../pages/export/export";
import { InAppBrowser } from '@ionic-native/in-app-browser';

// Providers
import { DataService } from './../../providers/data-service';
import { Utils } from "./../../providers/utils";
import { UploadProvider } from '../../providers/upload/upload';

export class LayerInfo {
  public img?: string;
  public layer?: Layer;

  public constructor(layer: Layer) {
    this.layer = layer;
  }
}

@Component({
  selector: "component-resume-view",
  templateUrl: "resume.html"
})
export class ResumeComponent {
  @Input()
  resume: Test;

  public imageFileBlock: string;
  public lastNumLayer: number;
  public layerArray: LayerInfo[];
  defaultImage: string;

  constructor(
    private dataService: DataService,
    public navCtrl: NavController,
    private iab : InAppBrowser,
    private uploadService : UploadProvider
  ) {}

  ngOnInit() {
    this.lastNumLayer = this.resume.layers.length;
    this.defaultImage = "./assets/icon/generic-image.png";
    this.imageFileBlock = this.resume.picture
      ? Utils.getPathForImage(this.dataService.getLocalDirectory(), this.resume.picture)
      : this.defaultImage;

    this.layerArray = [];
    for (let layer of this.resume.layers) //init all layers before read pictures of layer
      this.layerArray.push(new LayerInfo(layer));
    for (let layer of this.resume.layers) {
      this.layerArray[layer.num - 1].img = layer.picture
        ? Utils.getPathForImage(this.dataService.getLocalDirectory(), layer.picture)
        : this.defaultImage;
      this.layerArray = this.layerArray.slice(); // TODO: See if necessary
    }
  }

  openMap(event) {
    event.stopPropagation();

    let url = "http://maps.google.com/maps?q=" +
            this.resume.geolocation.latitude +
            "," +
            this.resume.geolocation.longitude;

    this.iab.create(url, "_system");

  }

  exportTest(event) {
    this.navCtrl.push(ExportPage, { test: this.resume });
  }

  uploadTest(event) {
    this.uploadService.uploadTest(this.resume);
  }
}
