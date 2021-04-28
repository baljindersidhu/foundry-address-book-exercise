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
    this.contactsService.getContacts().then(contacts => console.table(contacts));
  }

}
