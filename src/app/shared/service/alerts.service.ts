import { inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
private readonly alerts = inject(TuiAlertService);

constructor() { }

showAlert(type: string, header: string, message: string) {
  this.alerts
  .open(message, {label: header, appearance: type})
  .subscribe()
}

}
