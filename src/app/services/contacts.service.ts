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

  /**
   * 
   * @param pageNumber 
   * @param pageSize 
   * @param orderBy 
   * @param searchTerm 
   * @returns 
   */
  async getContacts(pageNumber: number, pageSize: number, orderBy ?: string, searchTerm ?: string): Promise<Contact[]>{
    const contacts = await this._ipc.invoke('get-contacts', JSON.stringify({
      pageNumber: pageNumber,
      pageSize: pageSize,
      orderBy: orderBy,
      searchTerm: searchTerm
    }));
    return contacts;
  }

  addContact(firstName: string, lastName: string, phoneNumber: string): Promise<void>{
    return this._ipc.invoke('add-contact', JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber
    }));
  }

}
