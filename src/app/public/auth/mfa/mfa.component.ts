import { Component, Input } from "@angular/core";

@Component({
  selector: "app-mfa",
  templateUrl: "./mfa.html",
  styleUrls: ["../../../../assets/slotsAssets/css/style.css"]
})
export class MFAComponent {
  @Input()
  destination: string;
  @Input()
  onSubmit: (code: string) => void;

  constructor() {
    console.log("MFAComponent constructor");
  }
}
