export class City {
  get accountType(): string {
    return this._accountType;
  }

  set accountType(value: string) {
    this._accountType = value;
  }
  get cityId(): number {
    return this._cityId;
  }

  set cityId(value: number) {
    this._cityId = value;
  }
  get zipCode(): string {
    return this._zipCode;
  }

  set zipCode(value: string) {
    this._zipCode = value;
  }

  get domain(): string {
    return this._domain;
  }

  set domain(value: string) {
    this._domain = value;
  }

  get cityStatus(): string {
    return this._cityStatus;
  }

  set cityStatus(value: string) {
    this._cityStatus = value;
  }

  private _cityId: number;
  private _cityName: string;
  private _street: string;
  private _city: string;
  private _state: string;
  private _zipCode: string;
  private _website: string;
  private _cityStatus: string;
  private _domain: string;
  private _accountType: string;


  /**
   * Getter cityName
   * @return {string}
   */

  // tslint:disable:indent
  public get cityName(): string {
    return this._cityName;
  }

  /**
   * Getter state
   * @return {string}
   */
  public get state(): string {
    return this._state;
  }

  /**
   * Getter city
   * @return {string}
   */
  public get city(): string {
    return this._city;
  }

  /**
   * Getter street
   * @return {string}
   */
  public get street(): string {
    return this._street;
  }

  /**
   * Getter website
   * @return {string}
   */
  public get website(): string {
    return this._website;
  }
//  /**
//    * Getter website
//    * @return {string}
//    */
//   public get website(): string {
//     return this._website;
//   }

//   /**
//    * Setter cityName
//    * @param {string} value
//    */
//   public set cityName(value: string) {
//     this._cityName = value;
//   }
  /**
   * Setter cityName
   * @param {string} value
   */
  public set cityName(value: string) {
    this._cityName = value;
  }

  /**
   * Setter state
   * @param {string} value
   */
  public set state(value: string) {
    this._state = value;
  }

  /**
   * Setter city
   * @param {string} value
   */
  public set city(value: string) {
    this._city = value;
  }

  /**
   * Setter street
   * @param {string} value
   */
  public set street(value: string) {
    this._street = value;
  }

  /**
   * Setter website
   * @param {string} value
   */
  public set website(value: string) {
    this._website = value;
  }
}
