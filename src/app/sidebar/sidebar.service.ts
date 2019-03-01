import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable()
export class SideBarService {
  isLogged = false;
  @Output() logged: EventEmitter<boolean> = new EventEmitter();
  logChange() {
    this.isLogged = !this.isLogged;
    this.logged.emit(this.isLogged);
  }
}