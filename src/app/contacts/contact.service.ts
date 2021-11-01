import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  // contactSelectedEvent: EventEmitter<Contact> = new EventEmitter<Contact>();
  // contactChangedEvent: EventEmitter<Contact[]> = new EventEmitter<Contact[]>();


  contactSelectedEvent= new Subject<Contact>();
  contactChangedEvent =  new Subject<Contact[]>();
  maxContactId:number;


  contacts: Contact[] = [];

  constructor() {
    this.contacts = MOCKCONTACTS;
  }

 

  getContacts(): Contact[] {
    return this.contacts.slice();
  }



  getContactindex(index:number){
    return this.contacts[index];
}


  getContact(id: string): Contact | null{
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
  }

  deleteContact(contact: Contact) { 

    if (!contact) {
      return;
   }
   const pos = this.contacts.indexOf(contact);
   if (pos < 0) {
      return;
   }
   this.contacts.splice(pos, 1);
   //this.contactChangedEvent.emit(this.contacts.slice());
   this.contactChangedEvent.next(this.contacts.slice());
  }


  addContact(newContact: Contact): void {
    if (!newContact) {
       return;
     }
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    let ContactsListClone = this.contacts.slice();
    this.contactChangedEvent.next(ContactsListClone)
 
 }
 
 
 updateContact(originalContact: Contact, newContact: Contact) {
 
    if(!originalContact || !newContact ){
       let pos = this.contacts.indexOf(originalContact)
       if (pos < 0){
          return;
       }
 
       newContact.id = originalContact.id;
       this.contacts[pos] = newContact;
       let ContactsListClone = this.contacts.slice();
       this.contactChangedEvent.next(ContactsListClone)
 
    }
  }



}