import { Component } from '@angular/core';
import { ContactsService } from './services/contacts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'foundry-address-book-exercise';

  constructor(private contactsService: ContactsService){
  }
  
  getContacts(){
    this.contactsService.getContacts(1, 10).then(contacts => console.table(contacts));
  }

  addContact(){
    this.contactsService.addContact('Random', 'Chikkibum', '916978856435').then(() => console.log('saved this'));
  }

  removeContact(){
    
  }

}
