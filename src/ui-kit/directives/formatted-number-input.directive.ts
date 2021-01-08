import { Directive, ElementRef, Renderer2, HostListener, Input, OnChanges, AfterViewChecked, Optional } from '@angular/core';
import { FormatService } from '../services/format.service';
import { NgControl, NgModel } from '@angular/forms';

// Use [innerText] for dynamic text

type InputNumber = null | string | number;

/**
 * @deprecated Use {@link NumberInputDirective} for inputs and {@link FormatNumberPipe} for static values
 */
@Directive({
  selector: '[appFormatNumber]'
})
export class FormattedNumberDirective implements AfterViewChecked, OnChanges {

  @Input() decimals: InputNumber = 2;
  @Input() min: InputNumber = null;
  @Input() max: InputNumber = null;

  formatted: string | null = null;

  @HostListener('blur') onBlur() {
    this.format();
  }
  @HostListener('keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
    const allowed = /[0-9-]/.test(e.key)
      || e.ctrlKey
      || ['Delete', 'Backspace', 'ArrowLeft', 'ArrowRight'].includes(e.key)
      || e.key === this.formatService.decimalSeparator;

    if (!allowed) {
      e.preventDefault();
    }
  }

  constructor(
    private el: ElementRef,
    private formatService: FormatService,
    private renderer: Renderer2,
    @Optional() private model: NgModel,
    @Optional() private control: NgControl
  ) {
  }

  extractValue() {
    if (this.control || this.model) {
      return this.el.nativeElement.value;
    }
    return (this.el.nativeElement as HTMLElement).innerText;
  }

  private isNumeric(value: InputNumber) {
    return isFinite(typeof value === 'number' ? value : parseFloat(value as string));
  }

  clamp(value: number, min: InputNumber, max: InputNumber): number {
    if (min !== null && this.isNumeric(min) && value < +min) {
      return +min;
    }
    if (max !== null && this.isNumeric(max) && value > +max) {
      return +max;
    }
    return value;
  }

  format() {
    const contentText = this.extractValue() || '0';
    const valueUpdated = this.formatted === null || contentText !== this.formatted;
    const number = valueUpdated ? +contentText : this.formatService.formattedNumberValue(contentText);
    const clamped = this.clamp(number || 0, this.min, this.max)
    const value = this.formatService.numberFormat(clamped, +(this.decimals as number), true);

    if (contentText === value) {
      return;
    }
    this.formatted = value;

    if (this.control && this.control.control) {
      this.control.control.setValue(value)
    }

    if (this.model && this.model.valueAccessor) {
      this.model.valueAccessor.writeValue(value);
    }

    if (!this.control && !this.model) {
      this.renderer.setProperty(this.el.nativeElement, 'textContent', value);
    }
  }

  ngAfterViewChecked() {
    this.format();
  }

  ngOnChanges() {
    this.format();
  }
}
