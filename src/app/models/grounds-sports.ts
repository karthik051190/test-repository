export class GroundsSports {
  private _gsId: number;
  private _groundId: number;
  private _groundName: string;
  private _sportId: number;
  private _sportName: string;
  private _parkId: number;
  private _cityId: number;
  private _gsStatus: string;

  get gsId(): number {
    return this._gsId;
  }

  set gsId(value: number) {
    this._gsId = value;
  }

  get groundId(): number {
    return this._groundId;
  }

  set groundId(value: number) {
    this._groundId = value;
  }

  get groundName(): string {
    return this._groundName;
  }

  set groundName(value: string) {
    this._groundName = value;
  }

  get sportId(): number {
    return this._sportId;
  }

  set sportId(value: number) {
    this._sportId = value;
  }

  get sportName(): string {
    return this._sportName;
  }

  set sportName(value: string) {
    this._sportName = value;
  }

  get parkId(): number {
    return this._parkId;
  }

  set parkId(value: number) {
    this._parkId = value;
  }

  get cityId(): number {
    return this._cityId;
  }

  set cityId(value: number) {
    this._cityId = value;
  }

  get gsStatus(): string {
    return this._gsStatus;
  }

  set gsStatus(value: string) {
    this._gsStatus = value;
  }
}