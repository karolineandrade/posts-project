import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { CommentInterface } from '../../shared/interface/CommentInterface';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TuiButton, TuiDialogContext, TuiDialogService, TuiIcon, TuiTextfield } from '@taiga-ui/core';
import { injectContext } from '@taiga-ui/polymorpheus';
import { TuiTextarea, TuiTextareaLimit } from '@taiga-ui/kit';
import {TuiInputModule, TuiTextfieldControllerModule} from '@taiga-ui/legacy';

@Component({
  selector: 'app-dialog-comment',
  templateUrl: './dialog-comment.component.html',
  styleUrls: ['./dialog-comment.component.css'],
  imports: [FormsModule, ReactiveFormsModule, TuiTextarea, TuiTextfieldControllerModule, TuiButton, TuiTextfield, TuiInputModule, TuiIcon, TuiTextareaLimit]

})
export class DialogCommentComponent implements OnInit {
  public readonly context = injectContext<TuiDialogContext<CommentInterface | undefined, CommentInterface | undefined>>();
  private readonly dialogs = inject(TuiDialogService);
  public formComment!: FormGroup;

  private formBuild: FormBuilder = inject(FormBuilder);

  constructor() { }

  ngOnInit() {
    this.initForm();

    if(this.context != undefined) {
      this.setFormValue()
    }
  }

  initForm(): void {
   this.formComment = this.formBuild.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      body: ['', Validators.required]
    })
  }

  setFormValue(): void {
    this.formComment.patchValue(this.post!);
  }

  get post(): CommentInterface | undefined {
        return this.context.data;
    }

  protected showDialog(content: TemplateRef<TuiDialogContext>): void {
        this.dialogs.open(content, {dismissible: true}).subscribe();
    }

    onSaveForm(): void {
      if(this.formComment.valid){
        this.context.completeWith(this.formComment.value)
      }
    }
}
