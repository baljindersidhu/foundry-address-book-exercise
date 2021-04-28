import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';

const electron = (<any>window).require('electron');

@Injectable({
  providedIn: 'root'
})
export class ContactsService {

  private _ipc;

  constructor() {
    this._ipc = electron.ipcRenderer;
  }

  async getContacts(): Promise<Contact[]>{
    const contacts = await this._ipc.invoke('get-contacts');
    return contacts;
  }

}
