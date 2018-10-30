export class Reservation {
  get selectedDate(): string {
    return this._selectedDate;
  }

  set selectedDate(value: string) {
    this._selectedDate = value;
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
  get residentOf(): string {
    return this._residentOf;
  }

  set residentOf(value: string) {
    this._residentOf = value;
  }
  private _residentOf: string;
  private _reservationId: number;
  private _phoneNumber: string;
  private _reservationDate: string;
  private _cityId: number;
  private _parkId: number;
  private _groundId: number;
  private _sportId: number;
  private _createdAt: string;
  private _reservationStatus: string;
  private _repId: number;
  private _firstName: string;
  private _lastName: string;
  private _email: string;
  private _teamName: string;
  private _slot: string;
  private _slotId: number;
  private _selectedDate: string;
  private _slots: any[];
  private _day: string;



  get reservationId(): number {
    return this._reservationId;
  }

  set reservationId(value: number) {
    this._reservationId = value;
  }

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  get reservationDate(): string {
    return this._reservationDate;
  }

  set reservationDate(value: string) {
    this._reservationDate = value;
  }

  get cityId(): number {
    return this._cityId;
  }

  set cityId(value: number) {
    this._cityId = value;
  }

  get parkId(): number {
    return this._parkId;
  }

  set parkId(value: number) {
    this._parkId = value;
  }

  get groundId(): number {
    return this._groundId;
  }

  set groundId(value: number) {
    this._groundId = value;
  }

  get sportId(): number {
    return this._sportId;
  }

  set sportId(value: number) {
    this._sportId = value;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  get reservationStatus(): string {
    return this._reservationStatus;
  }

  set reservationStatus(value: string) {
    this._reservationStatus = value;
  }

  get repId(): number {
    return this._repId;
  }

  set repId(value: number) {
    this._repId = value;
  }

  get firstName(): string {
    return this._firstName;
  }

  set firstName(value: string) {
    this._firstName = value;
  }

  get lastName(): string {
    return this._lastName;
  }

  set lastName(value: string) {
    this._lastName = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get teamName(): string {
    return this._teamName;
  }

  set teamName(value: string) {
    this._teamName = value;
  }

  get slot(): string {
    return this._slot;
  }

  set slot(value: string) {
    this._slot = value;
  }

  get slotId(): number {
    return this._slotId;
  }

  set slotId(value: number) {
    this._slotId = value;
  }
}
