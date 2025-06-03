import { ChangeDetectorRef, Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PostInterface } from '../shared/interface/PostInterface';
import { CommentsService } from '../shared/service/comments.service';
import { CommentInterface } from '../shared/interface/CommentInterface';
import { AlertsService } from '../shared/service/alerts.service';
import { StorageService } from '../shared/service/storage.service';
import {tuiDialog, TuiIcon, TuiButton} from '@taiga-ui/core';
import { DialogCommentComponent } from './dialog-comment/dialog-comment.component';
import { CommentItemComponent } from '../shared/components/comment-item/comment-item.component';
import {TuiBlockStatus} from '@taiga-ui/layout';
import {TuiLoader, tuiLoaderOptionsProvider} from '@taiga-ui/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  imports: [TuiIcon, TuiBlockStatus, TuiButton, TuiLoader, CommentItemComponent],
  providers: [tuiLoaderOptionsProvider({size: 'xl'})],

})
export class CommentsComponent implements OnInit, OnChanges {
  private commentsService: CommentsService = inject(CommentsService);
 private alertService: AlertsService = inject(AlertsService);
  private storageService: StorageService = inject(StorageService);
 private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public post = input<PostInterface>();
  public addComment = input<boolean>();

  public comments: CommentInterface[] = [];
  public isLoadingResults = true;
  public resultsLength = 0;
  public isEdit = false;
  public postId: number = 0;

    private dialog = tuiDialog(DialogCommentComponent, {
          dismissible: true,
          label: 'Comentário',
      });


  constructor() { }

  ngOnInit(): void {
    this.postId = this.post()?.id!;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['post']) {
          this.postId = this.post()?.id!;

      this.listComments()
    }

    if (changes['addComment'] && changes['addComment'].currentValue === true) {
    this.showDialogComment(false);
  }
  }

listComments(): void {
  this.commentsService.getCommentsInPost(this.postId!).subscribe({
    next: (response) => {
      this.isLoadingResults = false;
      const storageList = this.storageService.getFromStorage('comments_post_' + this.postId);
      if (!storageList) {
        this.storageService.saveToStorage('comments_post_' + this.postId, JSON.stringify(response));
      }

      this.listCommentsStorage();
    },
    error: (err: Error) => {
      console.error(err);
      this.isLoadingResults = false;
      this.alertService.showErrorAlert('Não foi possível listar comentários.');
    }
  });
}

private listCommentsStorage(): void {
  this.isLoadingResults = false;
  const storageList = this.storageService.getFromStorage('comments_post_' + this.postId);
  this.comments = storageList ? JSON.parse(storageList) as CommentInterface[] : [];
  this.resultsLength = this.comments.length;
  console.log(this.comments);
  this.cdr.markForCheck();
}


  newComment(data: any): void {
  let newP: CommentInterface = {
    name: data.name,
    body: data.body,
    email: data.email,
    postId: this.postId,
  }

  this.isLoadingResults = true;
  this.commentsService.createComment(newP).subscribe({
    next: (response) => {
      this.isLoadingResults = false;
      this.alertService.showSuccessAlert('Comentário criado com sucesso.');
      this.newPostToStorage(response);
    },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível criar novo comentário.');
     }
  })
}

newPostToStorage(data: CommentInterface): void {
  this.comments = [...this.comments, data];
  this.storageService.saveToStorage('comments_post_' + this.postId, JSON.stringify(this.comments));
  this.listCommentsStorage();
}

editComment(data: any, id: number | undefined): void {
      this.isLoadingResults = true;

  let newC: CommentInterface = {
    name: data.name,
    body: data.body,
    email: data.email,
    id: id
  }

  this.commentsService.patchComment(newC).subscribe({
    next: (response) => {
      this.isLoadingResults = false;
        this.alertService.showSuccessAlert('Comentário editado com sucesso.');
        this.editCommentStorage(response);

    },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível editar comentário.');
     }
  })
}

editCommentStorage(updated: CommentInterface): void {
  this.comments = this.comments.map((comment: CommentInterface) =>
    comment.id === updated.id ? updated : comment
  );
  this.storageService.saveToStorage('comments_post_' + this.postId, JSON.stringify(this.comments));
  this.listCommentsStorage();
}

deleteComment(index: number): void {
  this.isLoadingResults = true;
  this.commentsService.deleteComment(index).subscribe({
    next: (response) => {
      this.isLoadingResults = false;
        this.alertService.showSuccessAlert('Comentário deletado.');
        this.deleteCommentStorage(index);
    },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível deletar comentário.');
     }
  })
}

deleteCommentStorage(commentId: number): void {
  const filtered = this.comments.filter(comment => comment.id !== commentId);
  if (filtered.length !== this.comments.length) {
    this.comments = filtered;
    this.storageService.saveToStorage('comments_post_' + this.postId, JSON.stringify(this.comments));
    this.listCommentsStorage();
  }
}

  showDialogComment(isEdit: boolean, comment?: CommentInterface): void {
  this.isEdit = isEdit
    this.dialog(comment).subscribe({
        next: (data) => {
            console.info(`Dialog emitted data = ${data}`);
            if(isEdit) {
              this.editComment(data, comment?.id);
            } else {
            this.newComment(data);
            }
        },
        complete: () => {
            console.info('Dialog closed');
        },
    });
}



}
