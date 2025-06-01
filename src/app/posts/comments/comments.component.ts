import { Component, inject, input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { PostInterface } from '../../shared/interface/PostInterface';
import { CommentsService } from '../../shared/service/comments.service';
import { CommentInterface } from '../../shared/interface/CommentInterface';
import { AlertsService } from '../../shared/service/alerts.service';
import { StorageService } from '../../shared/service/storage.service';
import {TuiAvatar} from '@taiga-ui/kit';
import {TuiAutoColorPipe} from '@taiga-ui/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css'],
  imports: [TuiAvatar, TuiAutoColorPipe]
})
export class CommentsComponent implements OnChanges {
  private commentsService: CommentsService = inject(CommentsService);
 private alertService: AlertsService = inject(AlertsService);
  private storageService: StorageService = inject(StorageService);
  public post = input<PostInterface>();

  public comments: CommentInterface[] = [];
  public isLoadingResults = true;
  public resultsLength = 0;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['post']) {
      this.listComments()
    }
  }

  listComments(): void {
    const postId = this.post()?.id;

    this.commentsService.getCommentsInPost(postId!).subscribe({
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

getFirstChar(fullName: string): string {
  return fullName.charAt(0).toUpperCase();
}
}
