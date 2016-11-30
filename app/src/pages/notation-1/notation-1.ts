import { Component } from '@angular/core';

import { Notation2Page } from '../notation-2/notation-2';
import { NavController } from 'ionic-angular';

/*
  Generated class for the Notation2 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notation-1',
  templateUrl: 'notation-1.html'
})
export class Notation1Page {
  //declaration of field
  items: Array<{title: string, checked: Boolean, imgSrc:String, code:number}>;
  code:number;
  constructor(public navCtrl: NavController) {
    //construction of the list
    this.items = [
      { title: 'Pas de motte fermée', checked: false, imgSrc: './assets/icon/motte.png', code:1},
      { title: 'Présence possible de mottes fermées', checked: false, imgSrc: './assets/icon/motte.png',code:2 },
      { title: 'Présence majoritaire de mottes fermées', checked:false, imgSrc: './assets/icon/motte.png',code:3}
    ];
  }

  //Methods
  validationStep(){
      this.navCtrl.push(Notation2Page, {
        code: this.code,
      }).catch(()=> console.log('should I stay or should I go now'))
  }

  updateCheckedBox(position, item){
    //declar var
    let cnt: number = 0;

    for(let item of this.items) {
      //if position selected
      if(position==cnt){
        item.checked=true;
        this.code=item.code;
      }else{
        item.checked=false;
      }
      cnt++;
    }
  }

  showModal() {
    alert("aller salut !");
  }

}
