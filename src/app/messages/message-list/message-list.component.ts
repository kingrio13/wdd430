import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Message } from '../message.model';
import { MessageService } from '../message.service';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit, OnDestroy {
  messages: Message[] = [];
  messageInit:Subscription;
  messageList:Subscription;

  constructor(private messageService:MessageService) { }

  ngOnInit(): void {
    //this.messages = this.messageService.getMessages().slice();

    this.messageInit = this.messageService.getMessages().subscribe(messages =>{
      this.messages = messages;
   });


    this.messageList = this.messageService.messageChangedEvent.subscribe((messages) => this.messages = messages.slice());
  }


  onAddMessage(message: Message) {
    // this.messages.push(message);
    this.messageService.addMessage(message);
  }

  ngOnDestroy(){
    this.messageInit.unsubscribe();
    this.messageList.unsubscribe();
  }

}