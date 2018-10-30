export class Schedule {
  get endTime(): string {
    return this._endTime;
  }

  set endTime(value: string) {
    this._endTime = value;
  }
  get startTime(): string {
    return this._startTime;
  }

  set startTime(value: string) {
    this._startTime = value;
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
  private _slotPrice: any;
  private _paidSlot: any;
  private _scheduleId: number;
  private _sportId: number;
  private _groundId: number;
  private _startDate: string;
  private _endDate: string;
  private _slot: string;
  private _scheduleStatus: string;
  private _days: string;
  private _repId: number;
  private _parkId: number;
  private _startTime: string;
  private _endTime: string;
  private _openBefore: string;
  private _closeBefore: string;
  private _scheduleCategory: string;
  private _autoFIFO: any;

  get autoFIFO(): any {
    return this._autoFIFO;
  }

  set autoFIFO(value: any) {
    this._autoFIFO = value;
  }
  get scheduleCategory(): string {
    return this._scheduleCategory;
  }

  set scheduleCategory(value: string) {
    this._scheduleCategory = value;
  }

  get openBefore(): string {
    return this._openBefore;
  }

  set openBefore(value: string) {
    this._openBefore = value;
  }

  get closeBefore(): string {
    return this._closeBefore;
  }

  set closeBefore(value: string) {
    this._closeBefore = value;
  }

  get scheduleId(): number {
    return this._scheduleId;
  }

  set scheduleId(value: number) {
    this._scheduleId = value;
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

  get startDate(): string {
    return this._startDate;
  }

  set startDate(value: string) {
    this._startDate = value;
  }

  get endDate(): string {
    return this._endDate;
  }

  set endDate(value: string) {
    this._endDate = value;
  }

  get slot(): string {
    return this._slot;
  }

  set slot(value: string) {
    this._slot = value;
  }

  get scheduleStatus(): string {
    return this._scheduleStatus;
  }

  set scheduleStatus(value: string) {
    this._scheduleStatus = value;
  }

  get days(): string {
    return this._days;
  }

  set days(value: string) {
    this._days = value;
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
}
