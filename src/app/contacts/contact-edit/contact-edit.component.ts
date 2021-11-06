import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Contact } from '../contact.model';
import { ContactService } from '../contact.service';

@Component({
  selector: 'cms-contact-edit',
  templateUrl: './contact-edit.component.html',
  styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit, OnDestroy {
  subscription:Subscription;
  originalContact: Contact;
  contact: Contact;
  groupContacts: Contact[] = [];
  editMode: boolean = false;
  id: number;

  defaultimageUrl='';
  defaultPhone='';
  defaultEmail='';
  defaultName='';

  lastAddSuccessful:boolean | null;

  
  constructor( private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute) { }

    ngOnInit() {

      this.subscription = this.route.params.subscribe((params: Params) => {
        this.id = params.id;
        if (!this.id) {
          this.editMode = false;
          return;
        }
        this.originalContact = this.contactService.getContactindex(this.id);
        if (!this.originalContact) {
          return;
        }
        this.editMode = true;
        this.contact = JSON.parse(JSON.stringify(this.originalContact));

        if (this.contact?.group && this.contact?.group?.length > 0) {
          this.groupContacts = JSON.parse(JSON.stringify(this.originalContact.group));
        }

        this.initForm();

      });
  }


  onSubmit(form:NgForm) {
    //check editmode

    // console.log(this.editMode);
    const value = form.value;
    if (this.editMode){
      const newid = this.id.toString();
      const newContact = new Contact(newid, value.name, value.email, value.phone, value.imageUrl,this.groupContacts);
    
      this.contactService.updateContact(this.originalContact, newContact)
      console.log('updated');
    }
    else{
      this.contactService.addContact(form.value)
    }
    
    this.onCancel();
  }




  onCancel(){
    this.router.navigate(['../'], {relativeTo:this.route});
    
  }

  onRemoveItem(index: number) {
    if (index < 0 || index >= this.groupContacts.length) {
       return;
    }
    this.groupContacts.splice(index, 1);
 }


 
  ngOnDestroy(){
    this.subscription.unsubscribe;
  }

  
isInvalidContact(newContact: Contact) {
  if (!newContact) {// newContact has no value
    return true;
  }
  if (this.contact && newContact.id === this.contact.id) {
     return true;
  }
  for (let i = 0; i < this.groupContacts.length; i++){
     if (newContact.id === this.groupContacts[i].id) {
       return true;
    }
  }
  return false;
}


addToGroup($event: any) {
  const selectedContact: Contact = $event.dragData;


  const invalidGroupContact = this.isInvalidContact(selectedContact);
  if (invalidGroupContact){
    this.lastAddSuccessful = false;
     return;
  }
  this.groupContacts.push(selectedContact);
  this.lastAddSuccessful = true;


  
}





  private initForm(){

    this.defaultimageUrl=this.contact.imageUrl;
    this.defaultPhone=this.contact.phone;
    this.defaultEmail=this.contact.email;
    this.defaultName=this.contact.name;

  }

}
