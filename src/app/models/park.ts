export class ParkModel {
  get parkId(): number {
    return this._parkId;
  }

  set parkId(value: number) {
    this._parkId = value;
  }

  get parkName(): string {
    return this._parkName;
  }

  set parkName(value: string) {
    this._parkName = value;
  }

  get address(): string {
    return this._address;
  }

  set address(value: string) {
    this._address = value;
  }

  get website(): string {
    return this._website;
  }

  set website(value: string) {
    this._website = value;
  }

  get cityId(): number {
    return this._cityId;
  }

  set cityId(value: number) {
    this._cityId = value;
  }

  get parkStatus(): string {
    return this._parkStatus;
  }

  set parkStatus(value: string) {
    this._parkStatus = value;
  }
  private _parkId: number;
  private _parkName: string;
  private _address: string;
  private _website: string;
  private _cityId: number;
  private _parkStatus: string;
}
