import { DataJson } from './@types/types';
export default class Builder {
  public kuji(name: string): string {
    return `${name}さん`;
  }
  public grouping(group: string[][]): string {
    const response = group.reduce((previousArray, currentArray, index) => {
      const subGroup = currentArray.reduce(
        (previous, current) => `${previous} ${current},`,
        ''
      );
      return `${previousArray}\n${index}: ${subGroup}`;
    }, '');
    return response;
  }
  public list(json: DataJson[]): string {
    let response = '';
    json.forEach(
      (value) => (response += `${value.username}/${value.country}\n`)
    );
    return response;
  }
}
