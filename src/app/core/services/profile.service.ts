import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from '../../shared/apiUrl';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl: string;
    constructor(api: ApiUrls, private http: HttpClient) {
      this.apiUrl = api.profileUrl;
    }

  uploadPicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file',file);

    return this.http.post(`${this.apiUrl}/upload-profile-picture`, formData);
  }

  updateProfile(firstName: string, lastName: string): Observable<any> {
    const params = new HttpParams()
      .set('firstName', firstName)
      .set('lastName', lastName)
    return this.http.put(`${this.apiUrl}/update-profile`,null, {params});
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`,{oldPassword, newPassword});
  }
}
