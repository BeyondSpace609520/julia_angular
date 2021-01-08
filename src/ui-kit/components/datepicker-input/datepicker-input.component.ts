import {
  Component, ElementRef,
  EventEmitter,
  Inject,
  Input, OnChanges,
  OnDestroy,
  OnInit,
  Output, SimpleChanges, ViewChild,
} from '@angular/core';
import {NgbDatepicker, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {
  addDays,
  differenceInDays,
  getDate,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isToday,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds
} from 'date-fns';
import { convertDateStructToDate, hasRequiredField, isOnSameDay } from '../../utils/static.functions';
import {FormatService} from '../../services/format.service';
import {FormControl, FormGroup, NgModel} from '@angular/forms';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';
import { DATE_FORMAT_PROVIDER, PipeDate } from '@/ui-kit/injection';

const rangeDateStringDivider = ' - ';

@Component({
  selector: 'app-datepicker-input',
  templateUrl: './datepicker-input.component.html',
  styleUrls: ['./datepicker-input.component.scss']
})
export class DatepickerInputComponent implements OnInit, OnChanges, OnDestroy {
  @Input() date: Date; // primary date object, not needed as input on reactive form version
  @Input() dateControl: FormControl; // form control for the primary date object for reactive form version
  @Input() dateControlName: string; // form control name for the primary date object for reactive form version
  @Input() dateGroup: FormGroup; // form group for the primary date object for reactive form version
  @Input() disabled = false; // if the field is disabled
  @Input() inputId: string; // id for the input field
  @Input() mandatory: boolean; // if the field is mandatory
  @Input() maxDate: Date; // maximal accepted date for the datepicker
  @Input() minDate: Date; // minimal accepted date for the datepicker
  @Input() opened = false; // flag if the datepicker is opened
  @Input() placeholder: string; // placeholder parameter for the input field
  @Input() placement: 'top' | 'bottom' | 'bottomRight' | 'bottomLeft' = 'bottom'; // position the datepicker
  @Input() range: Date; // secondary date object, not needed as input on reactive form version
  @Input() rangeControl: FormControl; // form control for the secondary date object for reactive form version
  @Input() rangeControlName: string; // form control name for the secondary date object for reactive form version
  @Input() rangeGroup: FormGroup; // form group for the secondary date object for reactive form version
  @Input() signAsInvalid: boolean;
  @Output() dateChange = new EventEmitter<Date>(); // primary date changed
  @Output() openedChange = new EventEmitter<boolean>(); // opened status changed
  @Output() rangeChange = new EventEmitter<Date>(); // secondary date changed
  @Output() statusChange = new EventEmitter<string>(); // input control status changed
  @ViewChild('dateModel', { static: true }) dateModel: NgModel;
  @ViewChild('datepicker', { static: true }) datepicker: NgbDatepicker;
  @ViewChild('inputField', { static: true }) inputField: ElementRef;

  hoveredDate: Date;
  inputValue: string;
  convertDateStructToDate = convertDateStructToDate;
  maxDateStruct: NgbDateStruct;
  minDateStruct: NgbDateStruct;
  inputPattern: string;

  private rangeLength: number;
  private selectStarted = false;
  private destroy$ = new Subject();
  private valid = true;

  constructor(
    @Inject(DATE_FORMAT_PROVIDER) private dateFormatter: PipeDate,
    // public appService: AppService,
    public formatService: FormatService
  ) {}

  format(date: Date) {
    return this.formatService.dateFormat(date, this.dateFormatter.getFormat());
  }

  parse(dateStr: string | null): Date | null {
    return this.formatService.getFormattedDate(dateStr || '', this.dateFormatter.getFormat());
  }
  /**
   * Refreshes the input field value on external changes
   */
  refreshInputValue(forceUpdate = false) {
    const startDateStr = this.format(this.date);
    if (!this.isRangeDatePicker()) {
      if (forceUpdate || startDateStr) {
        this.inputValue = startDateStr || '';
      }
    } else {
      const endDateStr = this.format(this.range);
      if (this.date && this.range) {
        this.inputValue = startDateStr + rangeDateStringDivider + endDateStr;
      } else {
        this.inputValue = '';
      }
    }
  }

  /**
   * Updates dates on direct changes on the input field
   */
  setInputValue(dateStr: string) {
    this.inputValue = dateStr;
    if (!this.isRangeDatePicker()) {
      const date = this.parse(dateStr);
      if (date) {
        this.setDate(date);
        this.valid = true;
        // show the date in the datepicker
        this.datepicker.navigateTo({
          year: getYear(date),
          month: getMonth(date) + 1
        });
      } else {
        this.valid = false;
        this.setDate();
      }
    } else {
      const dateStrs = dateStr.split(rangeDateStringDivider);
      const start = this.parse(dateStrs[0]);
      if (start) {
        // show the start date in the datepicker
        this.datepicker.navigateTo({
          year: getYear(start),
          month: getMonth(start) + 1
        });
      }
      if (dateStrs.length === 2) {
        const end = this.parse(dateStrs[1]);
        if (start && end) {
          this.setDate(start);
          this.setRange(end);
          this.valid = true;
        } else {
          this.valid = false;
        }
      }
    }
  }

  /**
   * Checks the type of the datepicker
   */
  isRangeDatePicker(): boolean {
    return typeof this.range !== 'undefined';
  }

  isToday(date: NgbDate): boolean {
    return isToday(new Date(date.year, date.month - 1, date.day, 12));
  }

  /**
   * Open the datepicker
   */
  open() {
    this.selectStarted = false;
    this.opened = true;
    this.openedChange.emit(this.opened);
    // the opened date picker should show the month of the selected date range/simple date not the current month
    setTimeout(() => {
      if (this.datepicker && this.inputValue) {
        if (!this.isRangeDatePicker()) {
          const date = this.parse(this.inputValue);
          if (date) {
            this.datepicker.navigateTo({
              year: getYear(date),
              month: getMonth(date) + 1
            });
          }
        } else {
          const dateStrs = this.inputValue.split(rangeDateStringDivider);
          const start = this.parse(dateStrs[0]);
          if (start) {
            // show the start date in the datepicker
            this.datepicker.navigateTo({
              year: getYear(start),
              month: getMonth(start) + 1
            });
          }
        }
      }
    }, 50);
  }

  /**
   * Close the datepicker
   */
  close() {
    this.opened = false;
    this.openedChange.emit(this.opened);
  }

  /**
   * Updates the primary date object on datepicker or component input change
   */
  setDate(date?: Date, fromInput?: boolean) {
    if (date) {
      date = setHours(setMinutes(setSeconds(setMilliseconds(date, 0), 0), 0), 0);
    }
    this.date = date as any;
    if (this.dateControl) {
      this.dateControl.setValue(date && this.format(date), {emitEvent: !fromInput});
    }
    if (!fromInput) {
      this.dateChange.emit(this.date);
      if (this.isRangeDatePicker() && this.rangeLength > 0) {
        // if range length is already set it calculates the end date
        this.range = addDays(this.date, this.rangeLength);
      }
    } else if (this.isRangeDatePicker() && this.range) {
      this.rangeLength = differenceInDays(this.range, this.date);
    }
    this.refreshInputValue();
  }

  /**
   * Updates the secondary date object on datepicker or component input change
   */
  setRange(end: Date, fromInput?: boolean) {
    end = setHours(setMinutes(setSeconds(setMilliseconds(end, 0), 0), 0), 0);
    this.range = end;
    if (this.rangeControl) {
      this.rangeControl.setValue(this.format(end), {emitEvent: !fromInput});
    }
    if (!fromInput) {
      this.rangeChange.emit(this.range);
    }
    if (this.date) {
      this.rangeLength = differenceInDays(this.range, this.date);
    }
    this.refreshInputValue();
  }

  /**
   * Datepicker click event handler
   */
  onChange(dateStruct: NgbDateStruct) {
    const date = convertDateStructToDate(dateStruct);
    if (!this.isRangeDatePicker()) {
      this.setDate(date);
      this.close();
      // selected input is valid date
      this.valid = true;
    } else {
      if (!this.selectStarted) {
        // if range select is not started yet, it sets the start
        this.selectStarted = true;
        this.setDate(date);
      } else {
        // if range select is started already, it sets the end
        this.selectStarted = false;
        // if there's no start date or the end is after start
        if (!this.date || isAfter(date, this.date)) {
          this.setRange(date);
        } else {
          // if the date if before start switch dates
          this.setRange(this.date);
          this.setDate(date);
        }
        // selected input is valid date
        this.valid = true;
        this.close();
      }
    }
  }

  /**
   * Input field key up event handler
   */
  onInputKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.valid) {
      // if the user hits the enter key and the input is a valid date or range -> close the datepicker
      this.close();
    }
  }

  /**
   * Range datepicker helper for checking if range has a mouse over
   */
  isDateRangeHovered(dateStruct: NgbDateStruct): boolean {
    if (!this.isRangeDatePicker()) {
      return false;
    }
    const date = convertDateStructToDate(dateStruct);
    return this.date && this.selectStarted && this.hoveredDate && isAfter(date, this.date) && isBefore(date, this.hoveredDate);
  }

  /**
   * Range datepicker helper for checking if date is inside the range
   */
  isDateRangeInside(dateStruct: NgbDateStruct): boolean {
    if (!this.isRangeDatePicker()) {
      return false;
    }
    const date = convertDateStructToDate(dateStruct);
    return isAfter(date, this.date) && (this.hoveredDate && this.selectStarted ? isBefore(date, this.hoveredDate) : isBefore(date, this.range));
  }

  /**
   * Range datepicker helper for checking if date is the start of the range
   */
  isDateRangeFrom(dateStruct: NgbDateStruct): boolean {
    const date = convertDateStructToDate(dateStruct);
    return isOnSameDay(date, this.date);
  }

  /**
   * Range datepicker helper for checking if date is the end of the range
   */
  isDateRangeTo(dateStruct: NgbDateStruct): boolean {
    const date = convertDateStructToDate(dateStruct);
    if (!this.isRangeDatePicker()) {
      return isOnSameDay(date, this.date);
    } else {
      return (this.hoveredDate && this.selectStarted ? isOnSameDay(date, this.hoveredDate) : isOnSameDay(date, this.range));
    }
  }

  initializeControls() {
    if (typeof this.dateControl === 'undefined' && (typeof this.dateGroup !== 'undefined' && typeof this.dateControlName !== 'undefined')) {
      // if dateControl is not set
      this.dateControl = this.dateGroup.get(this.dateControlName) as FormControl;
    }
    if (this.dateControl) {
      if (hasRequiredField(this.dateControl)) {
        this.mandatory = true;
      }
      // reactive form version
      this.dateControl.valueChanges.pipe(
        takeUntil(this.destroy$)
      ).subscribe(value => {
        this.date = this.parse(value) as any; // TODO
        this.refreshInputValue();
        this.disabled = this.dateControl.disabled;
      });
      this.date = this.dateControl.value as any;
      this.refreshInputValue(true);
      this.disabled = this.dateControl.disabled;
    } else if (typeof this.date === 'undefined' || isNaN(getYear(this.date))) {
      // if not reactive form and date is not set or wrong format
      this.date = null as any;
    }
    // range
    if (typeof this.rangeControl === 'undefined' && (typeof this.rangeGroup !== 'undefined' && typeof this.rangeControlName !== 'undefined')) {
      // if dateControl is not set
      this.rangeControl = this.rangeGroup.get(this.rangeControlName) as FormControl;
    }
    if (this.rangeControl) {
      // reactive form version
      this.rangeControl.valueChanges.pipe(
        takeUntil(this.destroy$)
      ).subscribe(value => {
        this.range = this.parse(value) as any;
        this.refreshInputValue();
      });
      this.range = this.parse(this.rangeControl.value) as any;
    } else if (typeof this.range !== 'undefined' && isNaN(getYear(this.range))) {
      // if not reactive form and range is wrong format
      this.range = null as any;
    }
    this.refreshInputValue();
    this.inputPattern = this.formatService.getDateFormatPatternStr(this.dateFormatter.getFormat());
    if (this.isRangeDatePicker()) {
      this.inputPattern = this.inputPattern + rangeDateStringDivider + this.inputPattern;
    }
    this.dateModel.control.statusChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        this.statusChange.emit(value);
      })
    ;
  }

  ngOnInit(): void {
    this.initializeControls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.date || changes.range) {
      this.refreshInputValue();
    }
    if (changes.maxDate) {
      this.maxDateStruct = {
        year: getYear(changes.maxDate.currentValue),
        month: getMonth(changes.maxDate.currentValue) + 1,
        day: getDate(changes.maxDate.currentValue),
      };
    }
    if (changes.minDate) {
      this.minDateStruct = {
        year: getYear(changes.minDate.currentValue),
        month: getMonth(changes.minDate.currentValue) + 1,
        day: getDate(changes.minDate.currentValue),
      };
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
