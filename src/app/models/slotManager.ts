export class SlotManager {
  get groundName(): string {
    return this._groundName;
  }

  set groundName(value: string) {
    this._groundName = value;
  }
  get scheduleId(): number {
    return this._scheduleId;
  }

  set scheduleId(value: number) {
    this._scheduleId = value;
  }
  get slotDays(): any[] {
    return this._slotDays;
  }

  set slotDays(value: any[]) {
    this._slotDays = value;
  }
  get singleSlot(): string {
    return this._singleSlot;
  }

  set singleSlot(value: string) {
    this._singleSlot = value;
  }
  get sportId(): any {
    return this._sportId;
  }

  set sportId(value: any) {
    this._sportId = value;
  }

  get groundId(): any {
    return this._groundId;
  }

  set groundId(value: any) {
    this._groundId = value;
  }

  get repId(): any {
    return this._repId;
  }

  set repId(value: any) {
    this._repId = value;
  }

  get cityId(): any {
    return this._cityId;
  }

  set cityId(value: any) {
    this._cityId = value;
  }
  get selectedSport(): string {
    return this._selectedSport;
  }

  set selectedSport(value: string) {
    this._selectedSport = value;
  }

  get date(): string {
    return this._date;
  }

  set date(value: string) {
    this._date = value;
  }

  get day(): string {
    return this._day;
  }

  set day(value: string) {
    this._day = value;
  }

  get slots(): any[] {
    return this._slots;
  }

  set slots(value: any[]) {
    this._slots = value;
  }

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

  get startTime(): any {
    return this._startTime;
  }

  set startTime(value: any) {
    this._startTime = value;
  }

  get endTime(): any {
    return this._endTime;
  }

  set endTime(value: any) {
    this._endTime = value;
  }

  get repeatDays(): {} {
    return this._repeatDays;
  }

  set repeatDays(value: {}) {
    this._repeatDays = value;
  }

  get slotId(): number {
    return this._slotId;
  }

  set slotId(value: number) {
    this._slotId = value;
  }

  get slot(): string {
    return this._slot;
  }

  set slot(value: string) {
    this._slot = value;
  }

  get selectedSlot(): string {
    return this._selectedSlot;
  }

  set selectedSlot(value: string) {
    this._selectedSlot = value;
  }

  private _selectedSport: string;
  private _slotId: number;
  private _scheduleId: number;
  private _sportId: any;
  private _groundId: any;
  private _groundName: string;
  private _repId: any;
  private _cityId: any;
  private _date: string;
  private _day: string;
  private _slots: any[];
  private _startDate: any;
  private _endDate: any;
  private _startTime: any;
  private _endTime: any;
  private _singleSlot: string;
  private _slotDays: any[];
  private _repeatDays = {};
  private _slot: string;
  private _selectedSlot: string;
  // private allSlots
}
