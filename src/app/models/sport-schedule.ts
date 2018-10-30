export class SportSchedule {

  private _firstName: string;
  private _lastName: string;
  private _phoneNumber: string;
  private _slot: string;
  private _sport: string;
  private _selectedDate: Date;
  private _email: string;


  constructor(firstName: string, lastName: string, phoneNumber: string, slot: string, sport: string, selectedDate: Date, email: string) {
    this._firstName = firstName;
    this._lastName = lastName;
    this._phoneNumber = phoneNumber;
    this._slot = slot;
    this._sport = sport;
    this._selectedDate = selectedDate;
    this._email = email;
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

  get selectedDate(): Date {
    return this._selectedDate;
  }

  set selectedDate(value: Date) {
    this._selectedDate = value;
  }


  get email(): string {
    return this._email;
  }

  set email(value: string) {
    this._email = value;
  }
}
