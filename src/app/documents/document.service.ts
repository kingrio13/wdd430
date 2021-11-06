
import { Document } from './document.model';
import {MOCKDOCUMENTS} from './MOCKDOCUMENTS';
import { Subject } from 'rxjs';


export class DocumentService {

   

  documents: Document[] = [];
  documentSelectedEvent = new Subject<Document>();
  documentListChangedEvent = new Subject <Document[]>();
  startedEditing = new Subject<number>();
  maxDocumentId:number;


  

  constructor() { 
   this.documents=MOCKDOCUMENTS;
   this.maxDocumentId = this.getMaxId();
 }


 

  getDocuments(): Document[] {
    return this.documents.slice();
  }

  
//   getDocument(id: string): Document | null {
//     for (const document of this.documents) {
//     if (document.id === id) {
//       return document;
//     }
//   }
//   return null;
// }




  getDocument(index:number){
     return this.documents[index];
    }


   deleteDocument(document: Document) {
      if (!document) {
         return;
      }
      const pos = this.documents.indexOf(document);
      if (pos < 0) {
         return;
      }
      this.documents.splice(pos, 1);
      let documentsListClone = this.documents.slice();
      this.documentListChangedEvent.next(documentsListClone);
   }

   
getMaxId(): number {

   let maxId = 0;

   for(let document of this.documents){
      const currentId  = parseInt(document.id);
      if(currentId > maxId){
         maxId = currentId;
      }
   }
   return maxId
}

addDocument(newDocument: Document): void {
   if (!newDocument) {
      return;
    }
   this.maxDocumentId++;
   newDocument.id = this.maxDocumentId.toString();

   // console.log('get last id',newDocument.id);
   this.documents.push(newDocument);
   let documentsListClone = this.documents.slice();
   this.documentListChangedEvent.next(documentsListClone);

}


updateDocument(originalDocument: Document, newDocument: Document) {

   if(!originalDocument || !newDocument ){
      return;
   }
   let pos = this.documents.indexOf(originalDocument);
   if (pos < 0){
      return;
   } 

      newDocument.id = originalDocument.id;
      this.documents[pos] = newDocument;
      let documentsListClone = this.documents.slice();
      this.documentListChangedEvent.next(documentsListClone);

}


    





}
