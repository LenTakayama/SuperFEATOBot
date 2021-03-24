import { readFile } from 'fs/promises';
import { resolve } from 'path';
import { DataJson } from './@types/types';
export default class Model {
  private async loadDataJson(): Promise<DataJson[]> {
    const raw = await readFile(resolve(__dirname, '..', 'data', 'data.json'), {
      encoding: 'utf-8',
    }).then((buffer) => {
      return buffer.toString();
    });
    return <DataJson[]>JSON.parse(raw);
  }
  private rangeRandomNumber(maxNumber: number): number {
    return Math.floor(Math.random() * maxNumber);
  }
  private shuffle(array: string[]) {
    let count = array.length;
    while (count) {
      const changeKey = this.rangeRandomNumber(count--);
      const temp = array[count];
      const changeValue = array[changeKey];
      if (temp && changeValue) {
        array[count] = changeValue;
        array[changeKey] = temp;
      }
    }
    return array;
  }
  public async loadHelpMD(): Promise<string> {
    return await readFile(resolve(__dirname, '..', 'data', 'help.md'), {
      encoding: 'utf-8',
    }).then((buffer) => {
      return buffer.toString();
    });
  }
  public async featoKuji(): Promise<string> {
    const json = await this.loadDataJson();
    const random = this.rangeRandomNumber(json.length);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return json[random]!.username;
  }
  public async featoGrouping(number: string): Promise<string[][]> {
    const maxGroup = Number(number);
    if (isNaN(maxGroup)) throw TypeError('グループ数の指定が数字ではないです');
    let response: string[][] = new Array(3);
    for (let y = 0; y < maxGroup; y++) {
      response[y] = new Array(1);
    }
    const json = await this.loadDataJson();
    if (maxGroup <= json.length) {
      const result: string[][] = new Array(maxGroup);
      for (let y = 0; y < maxGroup; y++) {
        result[y] = [];
      }
      const shuffleUsername = this.shuffle(
        json.map((value) => {
          return value.username;
        })
      );
      shuffleUsername.forEach((value, index) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result[index % maxGroup]!.push(value);
      });
      response = result;
    } else {
      throw RangeError('メンバー数よりも大きいグループ数が指定されました');
    }
    return response;
  }
  public async honsuziList(): Promise<DataJson[]> {
    return await this.loadDataJson();
  }
  public async honsuziCountry(): Promise<string> {
    const json = await this.loadDataJson();
    const random = this.rangeRandomNumber(json.length);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return json[random]!.country;
  }
  public susanooKuji(...args: string[]): string {
    const random = this.rangeRandomNumber(args.length);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return args[random]!;
  }
  public susanooDice(dice: string): string {
    const structure = dice.split(/[dDｄＤ¥+]/);
    if (!structure[0] && !structure[1])
      throw TypeError('ダイスの指定が不正です');
    let number = Number(structure[0]);
    const side = Number(structure[1]);
    if (isNaN(number))
      throw TypeError('ダイスを振る回数の指定が数字ではないです');
    if (isNaN(side)) throw TypeError('ダイス面の指定が数字ではないです');
    let result = 0;
    if (structure[2]) {
      const sum = Number(structure[2]);
      if (isNaN(sum)) throw TypeError('加算の指定が数字ではないです');
      while (number) {
        result += this.rangeRandomNumber(side) + 1;
        number--;
      }
      result += sum;
    } else {
      while (number) {
        result += this.rangeRandomNumber(side) + 1;
        number--;
      }
    }
    return String(result);
  }
  // public susanooShuffle(...args: string[]): string[][] {}
}
