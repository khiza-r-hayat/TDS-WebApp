import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shipmentagepipe',
  standalone: true
})
export class ShipmentAgePipe implements PipeTransform {

  transform(value: Date | string | number): string {
    const now = new Date().getTime();
    const timestamp = new Date(value).getTime();
    const elapsed = now - timestamp;

    if (isNaN(timestamp)) {
      return 'Invalid date';
    }

    const seconds = Math.floor(elapsed / 1000);
    if (seconds < 60) {
      return seconds === 1 ? '1 s' : `${seconds} s`;
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return minutes === 1 ? '1 m' : `${minutes} m`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours === 1 ? '1 h' : `${hours} h`;
    }

    const days = Math.floor(hours / 24);
    if (days < 7) {
      return days === 1 ? '1 d' : `${days} d`;
    }

    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return weeks === 1 ? '1 w' : `${weeks} w`;
    }

    const months = Math.floor(days / 30);
    if (months < 12) {
      return months === 1 ? '1 mn' : `${months} mn`;
    }

    const years = Math.floor(days / 365);
    return years === 1 ? '1 y' : `${years} y`;
  }

}
