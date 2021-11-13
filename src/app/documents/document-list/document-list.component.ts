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
  private documentInit: Subscription;
  isFetching = false;


  documents: Document[] = [];

  constructor(private documentService: DocumentService) { }

  ngOnInit(): void {
    //this.documents = this.documentService.getDocuments();

    this.isFetching=true;
    this.documentInit = this.documentService.getDocuments().subscribe(docs =>{
      this.isFetching=false;
      this.documents = docs;
      //console.log(docs);
   });


    this.documentsList = this.documentService.documentListChangedEvent
      .subscribe((documents: Document[]) => {
        this.documents = documents;
      });

 

  }

  ngOnDestroy():void{
    this.documentsList.unsubscribe();
   }




}