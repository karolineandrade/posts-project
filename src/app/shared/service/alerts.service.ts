import { inject, Injectable } from '@angular/core';
import { TuiAlertService } from '@taiga-ui/core';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
private readonly alerts = inject(TuiAlertService);

constructor() { }

showSuccessAlert(message: string) {
  this.alerts
  .open(message, {label: 'Sucesso', appearance: 'success'})
  .subscribe()
}

showErrorAlert(message: string) {
  this.alerts
  .open(message, {label: 'Erro', appearance: 'negative'})
  .subscribe()
}


}
