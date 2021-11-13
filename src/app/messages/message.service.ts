import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { Message } from './message.model';
import { catchError, map  } from 'rxjs/operators';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  @Output() messageChangedEvent: EventEmitter<Message[]> = new EventEmitter<Message[]>();

  messages: Message[] = [];
  maxMessageId:number;

  constructor(private http:HttpClient) {
    //this.messages = MOCKMESSAGES;
  }

  getMaxId(): number {

    let maxId = 0;
 
    for(let messages of this.messages){
       const currentId  = parseInt(messages.id);
       if(currentId > maxId){
          maxId = currentId;
       }
    }
    return maxId
 }


  getMessages(){
    // return this.messages.slice();

    return this.http.get<Message[]>('https://cms430-456bf-default-rtdb.firebaseio.com/messages.json')
    .pipe(map((responseData)=>{
          this.messages = responseData;
          this.maxMessageId = this.getMaxId();
 
          this.messageChangedEvent.next(this.messages.slice());
          return this.messages;

     }), catchError(errorRes =>{
         return throwError(errorRes);
     })
     );

     
  }

  getMessage(id: string): Message | null {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message): void {
    this.messages.push(message);
    this.messageChangedEvent.emit(this.messages.slice());
    this.storeMessage();
  }



  storeMessage(){
    const docJson = JSON.stringify(this.messages);
    const httpParam = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    this.http.put<Document[]>('https://cms430-456bf-default-rtdb.firebaseio.com/messages.json', docJson, httpParam)
      .subscribe(() => {
          this.messageChangedEvent.next(this.messages.slice())
    });
  }

}