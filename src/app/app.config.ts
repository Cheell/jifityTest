import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { Observable } from 'rxjs';
import { routes } from './app.routes';
import { DataService } from './service/data-service.service';

function initializeApp(data: DataService) {
  return (): Observable<any> => data.fetchData()
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      multi: true,
      deps: [DataService],       
    }
  ]
};