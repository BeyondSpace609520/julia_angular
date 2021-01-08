import { ApiClient } from '@/app/helpers/api-client';
import { CacheService } from '@/app/helpers/cache.service';
import {
  MinMaxPersons,
  PricingForBEFE,
  RefreshShoppingCartPrices,
  ServiceTypeForPeriod
} from '@/ui-kit/components/modals/pricing-test-console/models';
import dayjs from 'dayjs';
import { SeasonPeriod } from '@/app/main/window/content/pricing-admin/season-periods/models';
import { Loading } from '@/app/shared/loader.decorator';
import { LoaderService } from '@/app/shared/loader.service';
import { Component, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pricing-test-console',
  templateUrl: './pricing-test-console.component.html',
  styleUrls: ['./pricing-test-console.component.sass']
})
export class PricingTestConsoleComponent {
  public isLoading: Observable<boolean>;
  public isLoadingRoom: Observable<boolean>;
  public isLoadingShoppingCart: Observable<boolean>;

  public modalType: 'category' | 'room';
  public categoryRooms: {e_id: number, e_uniqueNo: string}[];
  public noRoomsInThisEntityGroup: string;
  public period: SeasonPeriod;
  public serviceTypes: ServiceTypeForPeriod[];
  public minPerson: number;
  public maxPerson: number;
  public prices: PricingForBEFE;
  public nightsStay = 1;
  public actualRoomId: number;
  public maxGarages: number;
  public maxCots: number;
  public refreshShoppingCartIsDone = new EventEmitter<void>();

  constructor(
    private apiClient: ApiClient,
    private translate: TranslateService,
    private cacheService: CacheService,
    public loaderService: LoaderService,
  ) {
    this.isLoading = this.loaderService.isLoading('Init');
    this.isLoadingRoom = this.loaderService.isLoading('Room');
    this.isLoadingShoppingCart = this.loaderService.isLoading('ShoppingCart');
  }

  public async getServiceTypeForPeriod(roomId: number, fromDate: string): Promise<ServiceTypeForPeriod[]> {
    const {dbName, c_beLocale_id} = await this.cacheService.getCompanyDetails();
    return this.apiClient.getServiceTypeForPeriod(roomId, fromDate, 1, +c_beLocale_id, dbName).toPromise();
  }

  public async getMinMaxPersons(roomId: number, fromDate: string): Promise<MinMaxPersons> {
    const {dbName} = await this.cacheService.getCompanyDetails();
    return this.apiClient.getMinMaxPersons(roomId, fromDate, dbName).toPromise();
  }

  public refreshData(room: RefreshShoppingCartPrices) {
    if (+room.eId !== +this.actualRoomId && this.modalType === 'category') {
      this.actualRoomId = +room.eId;
      this.refreshRoomData().then(() => {
        this.refreshShoppingCartPrices(room).then(() => {
          setTimeout(() => { this.refreshShoppingCartIsDone.emit(); });
        });
      });
    } else {
      this.refreshShoppingCartPrices(room).then(() => {
        setTimeout(() => { this.refreshShoppingCartIsDone.emit(); });
      });
    }
  }

  @Loading('Room')
  public async refreshRoomData() {
    if (!this.actualRoomId || ! this.period) {
      return;
    }
    const fromDate = dayjs(this.period.fromDate).format('YYYY-MM-DD')
    const [serviceTypes, minMaxPersons] = await Promise.all(
      [
        this.getServiceTypeForPeriod(this.actualRoomId, fromDate),
        this.getMinMaxPersons(this.actualRoomId, fromDate),
      ]
    );
    this.serviceTypes = serviceTypes;
    this.minPerson = minMaxPersons.bc_minPersons;
    this.maxPerson = minMaxPersons.bc_maxPersons;
  }

  @Loading('ShoppingCart')
  public async refreshShoppingCartPrices(room: RefreshShoppingCartPrices) {
    const {dbName} = await this.cacheService.getCompanyDetails();
    this.nightsStay = room.nightsStay;
    this.prices = await this.apiClient.getPricingForBEFE(
      room.eId,
      room.arrivalDate,
      room.nightsStay,
      room.adults,
      room.children,
      room.birthDates,
      room.smallPets,
      room.largePets,
      room.catering,
      room.cots,
      room.garages,
      dbName
    ).toPromise();
    this.maxCots = +this.prices.maxCots;
    this.maxGarages = +this.prices.maxGarages;
  }

  @Loading('Init')
  public async init(period: SeasonPeriod, categoryId?: number, roomId?: number) {
    this.period = period;
    if (categoryId) {
      this.modalType = 'category';
      const categoryRooms = await this.apiClient.getCategoryEntityList(categoryId).toPromise();
      if (!categoryRooms || categoryRooms.length === 0 || categoryRooms[0] === 'ZERO') {
        this.noRoomsInThisEntityGroup = await this.translate.get('BackEnd_WikiLanguage.EG_NoRoomsInThisEntityGroup').toPromise();
      } else {
        this.categoryRooms = categoryRooms as {e_id: number, e_uniqueNo: string}[];
        this.actualRoomId = this.categoryRooms[0].e_id;
        await this.refreshRoomData();
      }
    } else if (roomId) {
      this.actualRoomId = roomId;
      this.modalType = 'room';
      await this.refreshRoomData();
    }
  }
}
