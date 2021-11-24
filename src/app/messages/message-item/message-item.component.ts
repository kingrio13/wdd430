import { Message } from './../message.model';
import { Component, Input, OnInit } from '@angular/core';
import { Contact } from 'src/app/contacts/contact.model';
import { ContactService } from 'src/app/contacts/contact.service';
import { isNull } from '@angular/compiler/src/output/output_ast';

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

    
     const contactName = this.contactService.getContact(this.message.sender);

     //this.messageSender ="";

     if(contactName){
        this.messageSender = contactName;
     }

     else{
      this.messageSender = "User";
     }
     
  }
}