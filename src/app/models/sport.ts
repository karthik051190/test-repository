export class Sport {
  private _sportId: number;
  private _sportName: string;
  private _checked: boolean;


  get checked(): boolean {
    return this._checked;
  }

  set checked(value: boolean) {
    this._checked = value;
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
}
