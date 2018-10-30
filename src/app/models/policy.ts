export class Policy {
  get policyId(): number {
    return this._policyId;
  }

  set policyId(value: number) {
    this._policyId = value;
  }

  get policyName(): string {
    return this._policyName;
  }

  set policyName(value: string) {
    this._policyName = value;
  }

  get reservationRequests(): number {
    return this._reservationRequests;
  }

  set reservationRequests(value: number) {
    this._reservationRequests = value;
  }

  get slotManager(): number {
    return this._slotManager;
  }

  set slotManager(value: number) {
    this._slotManager = value;
  }

  get reservationHistory(): number {
    return this._reservationHistory;
  }

  set reservationHistory(value: number) {
    this._reservationHistory = value;
  }

  get manageAdmins(): number {
    return this._manageAdmins;
  }

  set manageAdmins(value: number) {
    this._manageAdmins = value;
  }

  get manageCities(): number {
    return this._manageCities;
  }

  set manageCities(value: number) {
    this._manageCities = value;
  }
  private _policyId: number;
  private _policyName: string;
  private _reservationRequests: number;
  private _slotManager: number;
  private _reservationHistory: number;
  private _manageAdmins: number;
  private _manageCities: number;
}
