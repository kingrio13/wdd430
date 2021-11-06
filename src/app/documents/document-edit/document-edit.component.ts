import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DocumentService } from '../document.service';
import { Document } from '../document.model';



@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})
export class DocumentEditComponent implements OnInit, OnDestroy {


  @ViewChild('f') docForm:NgForm;
  document: Document;
  subscription:Subscription;
  editMode=false;
  id:number;
  originalDocument: Document;


  defaultTitle='';
  defaultUrl='';
  defaultDesc='';

  constructor(
              private documentService: DocumentService,
              private route:ActivatedRoute,
              private router:Router) { }

  ngOnInit() {
    this.subscription = this.route.params.subscribe((params: Params) => {
      this.id = params.id;
      if (!this.id) {
        this.editMode = false;
        return;
      }
      this.originalDocument = this.documentService.getDocument(this.id);
      if (!this.originalDocument) {
        return;
      }
      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument));
      this.initForm();

    });
    
}


  onSubmit(form:NgForm) {
    //check editmode

    // console.log(this.editMode);
    const value = form.value;
    if (this.editMode){
      const newid = this.id.toString();
      const newDocument = new Document(newid, value.name, value.description, value.url);
    
      this.documentService.updateDocument(this.originalDocument, newDocument)
    }
    else{
      this.documentService.addDocument(form.value)
    }
    
    this.onCancel();
  }


  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.route});
  }


  private initForm(){

    if(this.editMode){
     
        this.defaultTitle=this.document.name;
        this.defaultDesc = this.document.description;
        this.defaultUrl = this.document.url;
    }
  }

  ngOnDestroy(){
    this.subscription.unsubscribe;
  }

}
