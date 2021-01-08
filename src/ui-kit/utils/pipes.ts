import { buffer, filter, map, throttleTime } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { dubleClickDuration } from './constants';

export const doubleClick = () => {
  return <T>(source$: Observable<T>) => {
    return source$
      .pipe(
        buffer(source$.pipe(
          throttleTime(dubleClickDuration, undefined, { leading: true, trailing: true })
        )),
        filter(array => array.length >= 2),
        map(array => array[0])
      )
      ;
  };
};

export function withCtrlPressed() {
  return filter((event: WheelEvent) => event.ctrlKey);
}
