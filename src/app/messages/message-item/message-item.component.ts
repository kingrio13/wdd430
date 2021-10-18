import { Message } from './../message.model';
import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';

@Component({
  selector: 'cms-message-item',
  templateUrl: './message-item.component.html',
  styleUrls: ['./message-item.component.css'],
  providers:[ContactService]
})
export class MessageItemComponent implements OnInit{
  @Input() message: Message;
  messageSender: string;
  constructor(private contactService: ContactService) {}
  ngOnInit() {
     const contact: Contact | null = this.contactService.getContact(this.message.sender);

     if(contact){
      this.messageSender = contact.name;
     }
     else{
      this.messageSender = "User Unknown";
     }
     
  }
}