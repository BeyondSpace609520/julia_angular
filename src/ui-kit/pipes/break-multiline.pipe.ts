import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'breakMultiline'
})
export class BreakMultilinePipe implements PipeTransform {

  transform(text: string, breakStyle: BreakStyle = 'break'): string {
    return (breakStyle === 'paragraph' ? '<p>' : '') + replaceNewLines(text, breakString[breakStyle]) + (breakStyle === 'paragraph' ? '</p>' : '');
  }

}

function replaceNewLines(text: string, breakString: string): string {
  return text.replace(/[\n\r]+/g, breakString);
}

type BreakStyle = 'break' | 'paragraph';
const breakString: {[key in BreakStyle]: string} = {
  break: '<br>',
  paragraph: '</p><p>'
};
