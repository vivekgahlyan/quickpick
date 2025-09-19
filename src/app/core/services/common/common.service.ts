import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }
  http = inject(HttpClient);
  private apiUrl = 'https://dotnet-test-ci4i.onrender.com/api/QuickPick';

saveUserNote(username: string, notes: string): Observable<any> {
    const body = {
      username: username,
      notes: notes
    };
    return this.http.post(`${this.apiUrl}/SaveNotes`, body);
  }

getUserNotes(username: string): Observable<any>{
  return this.http.get(`${this.apiUrl}/GetUserNotes?usernameRequest=` + username);
}

}
