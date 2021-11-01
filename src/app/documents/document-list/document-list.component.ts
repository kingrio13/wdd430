import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { Document } from '../document.model';

import { DocumentService } from '../document.service';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
  @Output() selectedDocumentEvent: EventEmitter<Document> = new EventEmitter<Document>();

  private documentsList: Subscription;


  documents: Document[] = [];

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    this.documents = this.documentService.getDocuments();
    //this.documentService.documentChangedEvent.subscribe((documents) => this.documents = documents.slice())

    this.documentsList = this.documentService.documentListChangedEvent
      .subscribe((documentsList: Document[]) => this.documents = documentsList.slice());
  }

  ngOnDestroy():void{
    this.documentsList.unsubscribe();
   }


}