import { TestBed, inject } from "@angular/core/testing";

import { CityRequestsService } from "./city-requests.service";

describe("CityRequestsService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CityRequestsService]
    });
  });

  it("should be created", inject(
    [CityRequestsService],
    (service: CityRequestsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
