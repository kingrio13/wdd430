import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Subject, throwError } from 'rxjs';
import { Message } from './message.model';
import { catchError, map  } from 'rxjs/operators';
import { Contact } from '../contacts/contact.model';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  //@Output() messageChangedEvent: EventEmitter<Message[]> = new EventEmitter<Message[]>();

  messageChangedEvent =  new Subject<Message[]>();

  messages: Message[] = [];
  messageName:[];
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
    return this.http.get<{message:string, messageList:any}>('http://localhost:3000/messages')
    .pipe(map((responseData)=>{
          this.messages = responseData.messageList;
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


 

  addMessage(message: Message) {
  
  
   
    if (!message) {
      return;
    }

    //console.log('adding message');

    const headers = new HttpHeaders({'Content-Type': 'application/json'});
 
    // add to database
    this.http.post<{ messagelist: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
        
          this.messages.push(message);

          let messageListClone = this.messages.slice();
          this.messageChangedEvent.next(messageListClone);
        }
      );
  }


}



