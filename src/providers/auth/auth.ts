import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash';

@Injectable()
export class AuthProvider {
  skipIntro(): void {
    localStorage.setItem('intro', 'true');
  }
  showIntro(): boolean {
    return isEmpty(localStorage.getItem('intro'));
  }
}
