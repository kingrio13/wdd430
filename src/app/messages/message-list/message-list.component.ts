import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'as', 'The grades for this assignment have been posted', 'Bro. Jackson'),
    new Message('2', 'df', 'When is assignment 3 due', 'Steve Johnson'),
    new Message('3', 'gh', 'Assignment 3 is due on Saturday at 11:30PM', 'Bro. Jackson'),
    new Message('4', 'gh', 'Can I meet with you some time. I need help with assignment 3', 'Mark Smith'),
    new Message('5', 'gh', 'I can meet with you today at 4:00 PM in my office', 'Bro. Jackson'),
  ];
  constructor() { }

  ngOnInit(): void {
  }
  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}