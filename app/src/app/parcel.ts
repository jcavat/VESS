export class Parcel {
  public name: string;
  public ofag: string;
  public tests: Test[];
}

export class Test {
  public name: string;
  public date: string;
  public testScore: number;
  public blocks: Block[];
}

export class Block {
  public name: string;
  public blockScore: number;
}