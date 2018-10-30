export class Slot {
  get startDate(): any {
    return this._startDate;
  }

  set startDate(value: any) {
    this._startDate = value;
  }

  get endDate(): any {
    return this._endDate;
  }

  set endDate(value: any) {
    this._endDate = value;
  }
  get sport(): string {
    return this._sport;
  }

  set sport(value: string) {
    this._sport = value;
  }
  get startTime(): string {
    return this._startTime;
  }

  set startTime(value: string) {
    this._startTime = value;
  }

  get endTime(): string {
    return this._endTime;
  }

  set endTime(value: string) {
    this._endTime = value;
  }
  get slotId(): number {
    return this._slotId;
  }

  set slotId(value: number) {
    this._slotId = value;
  }

  get sportId(): number {
    return this._sportId;
  }

  set sportId(value: number) {
    this._sportId = value;
  }

  get groundId(): number {
    return this._groundId;
  }

  set groundId(value: number) {
    this._groundId = value;
  }

  get date(): string {
    return this._date;
  }

  set date(value: string) {
    this._date = value;
  }

  get slot(): string {
    return this._slot;
  }

  set slot(value: string) {
    this._slot = value;
  }

  get slotStatus(): string {
    return this._slotStatus;
  }

  set slotStatus(value: string) {
    this._slotStatus = value;
  }

  get scheduleId(): number {
    return this._scheduleId;
  }

  set scheduleId(value: number) {
    this._scheduleId = value;
  }

  get repId(): number {
    return this._repId;
  }

  set repId(value: number) {
    this._repId = value;
  }

  get parkId(): number {
    return this._parkId;
  }

  set parkId(value: number) {
    this._parkId = value;
  }
  get repName(): string {
    return this._repName;
  }

  set repName(value: string) {
    this._repName = value;
  }

  get openDate(): any {
    return this._openDate;
  }

  set openDate(value: any) {
    this._openDate = value;
  }
  get closeDate(): any {
    return this._closeDate;
  }

  set closeDate(value: any) {
    this._closeDate = value;
  }
  get slotCategory(): any {
    return this._slotCategory;
  }

  set slotCategory(value: any) {
    this._slotCategory = value;
  }
  get autoFIFO(): any {
    return this._autoFIFO;
  }

  set autoFIFO(value: any) {
    this._autoFIFO = value;
  }
  get paidSlot(): any {
    return this._paidSlot;
  }

  set paidSlot(value: any) {
    this._paidSlot = value;
  }
  get slotPrice(): any {
    return this._slotPrice;
  }

  set slotPrice(value: any) {
    this._slotPrice = value;
  }
  private _slotId: number;
  private _slotPrice: any;
  private _paidSlot: any;
  private _sportId: number;
  private _sport: string;
  private _groundId: number;
  private _date: string;
  private _slot: string;
  private _slotStatus: string;
  private _scheduleId: number;
  private _repId: number;
  private _parkId: number;
  private _startTime: string;
  private _endTime: string;
  private _repName: string;
  private _startDate: any;
  private _endDate: any;
  private _openDate: any;
  private _closeDate: any;
  private _slotCategory: any;
  private _autoFIFO: any;
}
