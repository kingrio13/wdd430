import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map  } from 'rxjs/operators';

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




  constructor(private http:HttpClient) {
    //this.contacts = MOCKCONTACTS;
  }


  getMaxId(): number {

    let maxId = 0;
 
    for(let contacts of this.contacts){
       const currentId  = parseInt(contacts.id);
       if(currentId > maxId){
          maxId = currentId;
       }
    }
    return maxId
 }




  getContacts(){
    //return this.contacts.slice();
    return this.http.get<Contact[]>('https://cms430-456bf-default-rtdb.firebaseio.com/contacts.json')
    .pipe(map((responseData)=>{
          this.contacts = responseData;
          this.maxContactId = this.getMaxId();

 
          this.contactChangedEvent.next(this.contacts.slice());
          return this.contacts;

     }), catchError(errorRes =>{
         return throwError(errorRes);
     })
     );

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
   this.storeContacts();
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

    this.storeContacts();
 
 }
 
 
 updateContact(originalContact: Contact, newContact: Contact) {
 
    if(!originalContact || !newContact ){
      return;
    }

    let pos = this.contacts.indexOf(originalContact)
    if (pos < 0){
       return;
    }

    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    let ContactsListClone = this.contacts.slice();
    this.contactChangedEvent.next(ContactsListClone)

    this.storeContacts();
  }






  storeContacts(){
    const docJson = JSON.stringify(this.contacts);
    const httpParam = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    this.http.put<Document[]>('https://cms430-456bf-default-rtdb.firebaseio.com/contacts.json', docJson, httpParam)
      .subscribe(() => {
          this.contactChangedEvent.next(this.contacts.slice())
    });
  }



}