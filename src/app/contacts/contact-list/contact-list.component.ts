import { Component, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';

import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';


@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
 
 
 contacts:Contact[]=[];

 private contactList:Subscription;
 private contactInit:Subscription;
  term:string;

  constructor(private contactService:ContactService) { }



  ngOnInit(): void {
    this.contactInit = this.contactService.getContacts().subscribe(contacts =>{
      this.contacts = contacts;
   });


    this.contactList = this.contactService.contactChangedEvent
    .subscribe((contacts: Contact[]) => {
      this.contacts = contacts;
    });


  }

  ngOnDestroy():void{
    this.contactList.unsubscribe();
    this.contactInit.unsubscribe();
   }


   search(value: string) {

    this.term = value;
    
    }


 

}
