import { EventEmitter, Injectable, Output } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { Contact } from './contact.model';
import { MOCKCONTACTS } from './MOCKCONTACTS';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, map  } from 'rxjs/operators';
import { isNull } from '@angular/compiler/src/output/output_ast';

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
    //return this.http.get<Contact[]>('https://cms430-456bf-default-rtdb.firebaseio.com/contacts.json')
    return this.http.get<{message:string, contacts:any}>('http://localhost:3000/contacts')
    .pipe(map((responseData)=>{


      this.contacts = responseData.contacts;
      //this.maxDocumentId = this.getMaxId();
      //this.sortDocuments();


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


  getContact(id:any|null){


  if(id){
    return id.name;
  }
  else{
    return null;
  }
    

    
  }



  deleteContact(contact: Contact) { 

    if (!contact) {
      return;
   }
   const pos = this.contacts.findIndex(d => d.id === contact.id);

   if (pos < 0) {
      return;
   }
   
    // delete from database
    console.log('position',pos); 
    this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe(() => {
      this.contacts.splice(pos, 1);
      //this.contactChangedEvent.emit(this.contacts.slice());
      this.contactChangedEvent.next(this.contacts.slice());
      });


  }


  addContact(newContact: Contact): void {


    if (!newContact) {
       return;
     }

     const headers = new HttpHeaders({'Content-Type': 'application/json'});

     // add to database
   this.http.post<{ message: string, contacts: Contact }>('http://localhost:3000/contacts',
   newContact,
   { headers: headers })
   .subscribe(
     (responseData) => {

      this.contacts.push(newContact);
      let ContactsListClone = this.contacts.slice();
      this.contactChangedEvent.next(ContactsListClone)
  
      //this.storeContacts();
   
     });

 
 }
 
 


 updateContact(originalContact: Contact, newContact: Contact) {

  
  if (!originalContact || !newContact) {
    return;
  }

  const pos = this.contacts.findIndex(d => d.id === originalContact.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newContact.id = originalContact.id;
this.contacts[pos] = newContact;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});


  // console.log(newContact);
  // update database
  this.http.put('http://localhost:3000/contacts/' + originalContact.id,
  newContact, { headers: headers })
    .subscribe(() => {

        newContact.id = originalContact.id;
        this.contacts[pos] = newContact;
        let ContactsListClone = this.contacts.slice();
        this.contactChangedEvent.next(ContactsListClone)

        // this.sortDocuments();
      }
    );

}
}







