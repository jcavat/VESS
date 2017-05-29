import { User } from './user';

export class Parcel {
  public name: string;
  public ofag?: string;
  public tests?: Test[];

  public constructor(init: Parcel) {
    Object.assign(this, init);
  }
}

export class Test {
  public name?: string;
  public date: string;
  public score?: number;
  public picture?: string;
  public layers?: Layer[];
  public thickness?: number;
  public user?: User;
  public completed?: Boolean = false;

  public constructor(init: Test) {
    Object.assign(this, init);
  }
}

export class Layer {
  public num: number;
  public score: number;
  public picture: string;
  public thickness: number;

  constructor(num: number, thickness: number) {
    this.num = num;
    this.thickness = thickness;
  }
}
