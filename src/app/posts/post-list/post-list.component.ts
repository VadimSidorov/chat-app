import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  constructor(public postsService: PostService, private authService: AuthService) {}
  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private authStatusSubs: Subscription;
  isAuth = false;
  userId: string;

  ngOnInit() {
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.isLoading = true;
    this.userId = this.authService.getUserId()
    this.postsSub = this.postsService.getPostUpdateListner()
      .subscribe((postData: {posts: Post[], postAmount: number}) => {
        this.posts = postData.posts;
        this.totalPosts = postData.postAmount;
        this.isLoading = false;
      });
    this.isAuth = this.authService.getIsAuth();
    this.authStatusSubs = this.authService.getAuthStatusListner().subscribe(result => {
      this.isAuth = result;
      this.userId = this.authService.getUserId();
    });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    console.log(pageData)
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(posdId: string) {
    this.isLoading = true;
    this.postsService.deletePost(posdId).subscribe(() => {
      this.postsService.getPosts(this.postsPerPage, this.currentPage)
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSubs.unsubscribe();
  }
}
