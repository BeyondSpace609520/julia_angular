import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

const maxStrength  = 50;
const maxStrengthLevel  = 5;

@Component({
  selector: 'app-password-strength-bar',
  templateUrl: './password-strength-bar.component.html',
  styleUrls: ['./password-strength-bar.component.scss']
})
export class PasswordStrengthBarComponent implements OnInit, OnChanges {
  @Input() password: string;
  @Input() numberOfBars = 5;

  public bars: boolean[] = [];
  private strength = 0;
  public strengthLevel = 1;

  constructor() { }

  private createBars(nonEmpty?: boolean): void {
    const steps = maxStrength / this.numberOfBars;
    this.bars = new Array(this.numberOfBars).fill(false).map((b, i) => {
      if (nonEmpty && i === 0) {
        return true;
      }
      return (i + 1) * steps <= this.strength;
    });
  }

  ngOnInit(): void {
    this.createBars();
  }

  ngOnChanges({password, numberOfBars}: SimpleChanges): void {
    if (password) {
      this.strength = measureStrength(password.currentValue);
      this.strengthLevel = Math.max(1, Math.min(Math.floor(this.strength / (maxStrength / maxStrengthLevel)), maxStrengthLevel));
      this.createBars(password.currentValue && password.currentValue.length > 0);
    }
    if (numberOfBars) {
      this.createBars();
    }
  }
}

function measureStrength(value: string): number {
  let strength = 0;
  if (!value) {
    return strength;
  }

  const lowerLetters = /[a-z]+/.test(value);
  const upperLetters = /[A-Z]+/.test(value);
  const numbers = /[0-9]+/.test(value);
  const symbols = /[$-/:-?{-~!"^_`\[\]]/g.test(value);

  const flags = [lowerLetters, upperLetters, numbers, symbols];

  const matches = flags.filter(f => f).length;

  strength += 2 * value.length + ((value.length >= 10) ? 1 : 0);
  strength += matches * 10;

  // penalty (short password)
  strength = (value.length <= 6) ? Math.min(strength, 10) : strength;

  // penalty (poor variety of characters)
  strength = (matches === 1) ? Math.min(strength, 10) : strength;
  strength = (matches === 2) ? Math.min(strength, 20) : strength;
  strength = (matches === 3) ? Math.min(strength, 40) : strength;

  return strength;
}
