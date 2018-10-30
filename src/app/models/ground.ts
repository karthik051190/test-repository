export class Ground {
  get sportName(): string {
    return this._sportName;
  }

  set sportName(value: string) {
    this._sportName = value;
  }
  get groundId(): number {
    return this._groundId;
  }

  set groundId(value: number) {
    this._groundId = value;
  }

  get parkId(): number {
    return this._parkId;
  }

  set parkId(value: number) {
    this._parkId = value;
  }
  get groundStatus(): string {
    return this._groundStatus;
  }

  set groundStatus(value: string) {
    this._groundStatus = value;
  }
  get groundName(): string {
    return this._groundName;
  }

  set groundName(value: string) {
    this._groundName = value;
  }
  private _groundId: number;
  private _groundName: string;
  private _parkId: number;
  private _groundStatus: string;
  private _sportName: string;
}
