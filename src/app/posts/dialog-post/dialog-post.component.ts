import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgControl, ReactiveFormsModule, Validators } from '@angular/forms';
	import {TuiButton, TuiDialogContext, TuiDialogService, TuiTextfield} from '@taiga-ui/core';
import {TuiTextarea} from '@taiga-ui/kit';
import { PostInterface } from '../../shared/interface/PostInterface';
import {injectContext} from '@taiga-ui/polymorpheus';
import {TuiInputModule} from '@taiga-ui/legacy';
import {TuiIcon} from '@taiga-ui/core';

@Component({
  selector: 'app-dialog-post',
  templateUrl: './dialog-post.component.html',
  styleUrls: ['./dialog-post.component.css'],
  imports: [FormsModule, ReactiveFormsModule, TuiTextarea, TuiButton, TuiTextfield, TuiInputModule,TuiIcon]
})
export class DialogPostComponent implements OnInit {
  public readonly post = injectContext<TuiDialogContext<PostInterface | undefined, PostInterface | undefined>>();
  private readonly dialogs = inject(TuiDialogService);
  public formPost!: FormGroup;

  private formBuild: FormBuilder = inject(FormBuilder);

  constructor() { }

  ngOnInit() {
    this.initForm();
  }

  initForm(): void {
   this.formPost = this.formBuild.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    })
  }

  get data(): PostInterface | undefined {
        return this.post.data;
    }

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
        this.dialogs.open(content, {dismissible: true}).subscribe();
    }

}


