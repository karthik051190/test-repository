export class User {
  get reservationId(): any {
    return this._reservationId;
  }

  set reservationId(value: any) {
    this._reservationId = value;
  }
  get groundName(): string {
    return this._groundName;
  }

  set groundName(value: string) {
    this._groundName = value;
  }
  get adminGroundId(): string {
    return this._adminGroundId;
  }

  set adminGroundId(value: string) {
    this._adminGroundId = value;
  }
  get adminParkId(): string {
    return this._adminParkId;
  }

  set adminParkId(value: string) {
    this._adminParkId = value;
  }
  get adminPolicy(): string {
    return this._adminPolicy;
  }

  set adminPolicy(value: string) {
    this._adminPolicy = value;
  }

  get username(): string {
    return this._username;
  }

  set username(value: string) {
    this._username = value;
  }
  get slotStatus(): string {
    return this._slotStatus;
  }

  set slotStatus(value: string) {
    this._slotStatus = value;
  }
  get status(): string {
    return this._status;
  }

  set status(value: string) {
    this._status = value;
  }
  get teamName(): string {
    return this._teamName;
  }

  set teamName(value: string) {
    this._teamName = value;
  }
  private _username: string;
  private _firstName: string;
  private _lastName: string;
  private _teamName: string;
  private _status: string;
  private _phoneNumber: string;
  private _slot: string;
  private _sport: string;
  private _selectedDate: string;
  private _email: string;
  private _timeStamp: Date;
  private _slotId: any;
  private _slotStatus: string;
  private _adminPolicy: string;
  private _adminParkId: string;
  private _adminGroundId: string;
  private _groundName: string;
  private _reservationId: any;

  // constructor(firstName: string, lastName: string, phoneNumber: string, slot: string, sport: string, selectedDate: Date, email: string) {
  //   this._firstName = firstName;
  //   this._lastName = lastName;
  //   this._phoneNumber = phoneNumber;
  //   this._slot = slot;
  //   this._sport = sport;
  //   this._selectedDate = selectedDate;
  //   this._email = email;
  // }


  get slotId(): any {
    return this._slotId;
  }

  set slotId(value: any) {
    this._slotId = value;
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

  get phoneNumber(): string {
    return this._phoneNumber;
  }

  set phoneNumber(value: string) {
    this._phoneNumber = value;
  }

  get slot(): string {
    return this._slot;
  }

  set slot(value: string) {
    this._slot = value;
  }

  get sport(): string {
    return this._sport;
  }

  set sport(value: string) {
    this._sport = value;
  }

  get selectedDate(): string {
    return this._selectedDate;
  }

  set selectedDate(value: string) {
    this._selectedDate = value;
  }

  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }

  get timeStamp(): Date {
    return this._timeStamp;
  }

  set timeStamp(value: Date) {
    this._timeStamp = value;
  }
}
