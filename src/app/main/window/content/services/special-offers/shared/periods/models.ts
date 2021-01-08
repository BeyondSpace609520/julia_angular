import { WeekDayItem } from '@/app/main/window/shared/periods/models';
import { SpecialOfferPeriod } from '../../models';

export interface SpecialOfferPeriodView extends SpecialOfferPeriod {
    fromWeekDay: WeekDayItem;
    untilWeekDay: WeekDayItem;
}
