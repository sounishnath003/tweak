import { HttpHeaders } from '@angular/common/http';

export function generateHeaderOptions() {
  const accessToken = JSON.parse(
    localStorage.getItem('user') || JSON.stringify({ accessToken: '' })
  ).accessToken;
  const httpHeader = new HttpHeaders();
  httpHeader.append('Authorization', `Bearer ${accessToken}`);
  return httpHeader;
}
