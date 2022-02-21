import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

export function handleError(error: HttpErrorResponse) {
  if (error.status === 0) {
    // client side n/w error happended
    console.error('An error occured: ', error.error);
  } else {
    console.error(
      `Backend returned error code ${error.status} body was: `,
      error.error
    );
  }

  return throwError(() => new Error(error.error.message));
}
