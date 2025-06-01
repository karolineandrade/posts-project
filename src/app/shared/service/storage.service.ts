import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

constructor() { }

saveToStorage(key: string, value: string): void {
  localStorage.setItem(key, value);
}

getFromStorage(key: string): string | null {
 return localStorage.getItem(key);
}

removeItemStorage(key: string): void {
  localStorage.removeItem(key);
}

clearStorage(): void {
  localStorage.clear();
}

/* posts methods */
}
