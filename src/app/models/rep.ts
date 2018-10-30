export class Rep {
    get permission(): string {
        return this._permission;
    }

    set permission(value: string) {
        this._permission = value;
    }
    get repId(): number {
        return this._repId;
    }

    set repId(value: number) {
        this._repId = value;
    }

    get repStatus(): string {
        return this._repStatus;
    }

    set repStatus(value: string) {
        this._repStatus = value;
    }

    get defaultParkId(): number {
        return this._defaultParkId;
    }

    set defaultParkId(value: number) {
        this._defaultParkId = value;
    }

    get defaultGroundId(): number {
        return this._defaultGroundId;
    }

    set defaultGroundId(value: number) {
        this._defaultGroundId = value;
    }

    private _repId: number;
    private _firstName: string;
    private _lastName: string;
    private _phoneNumber: string;
    private _email: string;
    private _policyID: string;
    private _repStatus: string;
    private _username: string;
    private _cityID: number;
    private _defaultParkId: number;
    private _defaultGroundId: number;
    private _permission: string;

    /**
       * Getter firstName
       * @return {string}
       */
    // tslint:disable:indent
    public get firstName(): string {
        return this._firstName;
    }

    /**
     * Getter lastName
     * @return {string}
     */
    public get lastName(): string {
        return this._lastName;
    }

    /**
     * Getter phoneNumber
     * @return {string}
     */
    public get phoneNumber(): string {
        return this._phoneNumber;
    }

    /**
     * Getter email
     * @return {string}
     */
    public get email(): string {
        return this._email;
    }

    /**
     * Getter policyID
     * @return {string}
     */
    public get policyID(): string {
        return this._policyID;
    }

    /**
     * Getter username
     * @return {string}
     */
    public get username(): string {
        return this._username;
    }

    /**
     * Getter cityID
     * @return {number}
     */
    public get cityID(): number {
        return this._cityID;
    }

    /**
     * Getter groundID
     * @return {number}
     */
    public get groundID(): number {
        return this._groundID;
    }

    /**
     * Setter firstName
     * @param {string} value
     */
    public set firstName(value: string) {
        this._firstName = value;
    }

    /**
     * Setter lastName
     * @param {string} value
     */
    public set lastName(value: string) {
        this._lastName = value;
    }

    /**
     * Setter phoneNumber
     * @param {string} value
     */
    public set phoneNumber(value: string) {
        this._phoneNumber = value;
    }

    /**
     * Setter email
     * @param {string} value
     */
    public set email(value: string) {
        this._email = value;
    }

    /**
     * Setter policyID
     * @param {string} value
     */
    public set policyID(value: string) {
        this._policyID = value;
    }


    /**
     * Setter username
     * @param {string} value
     */
    public set username(value: string) {
        this._username = value;
    }

    /**
     * Setter cityID
     * @param {number} value
     */
    public set cityID(value: number) {
        this._cityID = value;
    }

    /**
       * Setter groundID
       * @param {number} value
       */
    public set groundID(value: number) {
        this._groundID = value;
    }
    private _groundID: number;
}
