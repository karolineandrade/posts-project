import { ChangeDetectorRef, Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PostInterface } from '../../shared/interface/PostInterface';
import { CommentsService } from '../../shared/service/comments.service';
import { CommentInterface } from '../../shared/interface/CommentInterface';
import { AlertsService } from '../../shared/service/alerts.service';
import { StorageService } from '../../shared/service/storage.service';
import {TuiAvatar} from '@taiga-ui/kit';
import {TuiAutoColorPipe} from '@taiga-ui/core';
import {tuiDialog, TuiIcon, TuiIconPipe} from '@taiga-ui/core';
import { DialogCommentComponent } from './dialog-comment/dialog-comment.component';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  imports: [TuiAvatar, TuiAutoColorPipe, TuiIcon]
})
export class CommentsComponent implements OnInit, OnChanges {
  private commentsService: CommentsService = inject(CommentsService);
 private alertService: AlertsService = inject(AlertsService);
  private storageService: StorageService = inject(StorageService);
 private cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

  public post = input<PostInterface>();

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
      this.listComments()
    }
  }

  listComments(): void {
    this.commentsService.getCommentsInPost(this.postId!).subscribe({
      next: (response) => {
        this.comments = response;
      },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível listar comentários.');
     }
    })
  }

  private listCommentsStorage(): void {
  this.isLoadingResults = false;
  const storageList = this.storageService.getFromStorage('comments');
  this.comments = storageList ? JSON.parse(storageList) as CommentInterface[] : [];
  this.resultsLength = this.comments.length;
  console.log(this.comments)
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
      this.newCommentToStorage(response);
    },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível criar novo comentário.');
     }
  })
}

newCommentToStorage(data: CommentInterface): void {
  this.comments.push(data);
  this.storageService.saveToStorage('comments', JSON.stringify(this.comments));
  console.log(data)
  this.listCommentsStorage();
}

editComment(data: any): void {
      this.isLoadingResults = true;

  let newC: CommentInterface = {
    name: data.name,
    body: data.body,
    email: data.email,
    postId: this.postId
  }

  this.commentsService.patchComment(newC).subscribe({
    next: (response) => {
      this.editCommentStorage(response);
      this.isLoadingResults = false;
        this.alertService.showSuccessAlert('Comentário editado com sucesso.');

    },
      error: (err: Error) => {
        console.error(err);
        this.isLoadingResults = false;
        this.alertService.showErrorAlert('Não foi possível editar comentário.');
     }
  })
}
// CAPRICHOSO TETRA
editCommentStorage(data: CommentInterface): void {
  const updateList = this.comments.map((post: CommentInterface) => post.id === data.id ? data : post)
  this.storageService.saveToStorage('posts', JSON.stringify(updateList));
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

deleteCommentStorage(postId: number): void {
  const index = this.comments.findIndex(post => post.id === postId);
  if (index !== -1) {
    this.comments.splice(index, 1);
    this.storageService.saveToStorage('posts', JSON.stringify(this.comments));
    this.listCommentsStorage();
  }
}



  showDialogComment(isEdit: boolean, comment?: CommentInterface): void {
//   this.isEdit = isEdit
//     this.dialog(comment).subscribe({
//         next: (data) => {
//             console.info(`Dialog emitted data = ${data}`);
//             if(isEdit) {
//               this.editComment(data);
//             } else {
//             this.newComment(data);
//             }
//         },
//         complete: () => {
//             console.info('Dialog closed');
//         },


//     });
}


getFirstChar(fullName: string): string {
  return fullName.charAt(0).toUpperCase();
}
}
