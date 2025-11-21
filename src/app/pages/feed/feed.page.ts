import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss']
})
export class FeedPage implements OnInit
import { Router } from '@angular/router';
import { InfiniteScrollCustomEvent, RefresherCustomEvent } from '@ionic/angular';
import { ApiService } from '../../services/api.service';


interface Post {
  id: number;
  caption: string;
  image_url: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  user: {
    id: number;
    name: string;
    username: string;
    profile_picture?: string;
  };
  created_at: string;
}

@Component({
  selector: 'app-feed',
  templateUrl: 'feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {
  posts: Post[] = [];
  currentPage: number = 1;
  isLoading: boolean = false;
  hasMorePages: boolean = true;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPosts();
  }

  // Cargar publicaciones
  async loadPosts(event?: any) {
    if (this.isLoading) return;
    
    this.isLoading = true;

    try {
      const response = await this.apiService.getPosts(this.currentPage).toPromise();
      
      if (event) {
        this.posts = [...this.posts, ...response.data];
        event.target.complete();
      } else {
        this.posts = response.data;
      }

      this.hasMorePages = response.current_page < response.last_page;
      this.currentPage = response.current_page + 1;

    } catch (error) {
      console.error('Error al cargar posts:', error);
      if (event) {
        event.target.complete();
      }
    } finally {
      this.isLoading = false;
    }
  }

  // Refrescar feed
  async refreshFeed(event: RefresherCustomEvent) {
    this.currentPage = 1;
    this.hasMorePages = true;
    
    try {
      const response = await this.apiService.getPosts(1).toPromise();
      this.posts = response.data;
      this.currentPage = 2;
      this.hasMorePages = response.current_page < response.last_page;
    } catch (error) {
      console.error('Error al refrescar:', error);
    } finally {
      event.target.complete();
    }
  }

  // Cargar más posts
  loadMorePosts(event: InfiniteScrollCustomEvent) {
    if (this.hasMorePages) {
      this.loadPosts(event);
    } else {
      event.target.complete();
    }
  }

  // Toggle like
  async toggleLike(post: Post) {
    const originalState = post.is_liked;
    const originalCount = post.likes_count;

    post.is_liked = !post.is_liked;
    post.likes_count += post.is_liked ? 1 : -1;

    try {
      if (post.is_liked) {
        await this.apiService.likePost(post.id).toPromise();
      } else {
        await this.apiService.unlikePost(post.id).toPromise();
      }
    } catch (error) {
      post.is_liked = originalState;
      post.likes_count = originalCount;
      console.error('Error al dar like:', error);
    }
  }

  // Navegar a detalle
  goToPostDetail(postId: number) {
    this.router.navigate(['/post-detail', postId]);
  }

  // Crear post
  goToCreatePost() {
    this.router.navigate(['/create-post']);
  }

  // Ver perfil
  goToProfile(userId: number) {
    this.router.navigate(['/profile', userId]);
  }

  // Formatear fecha
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return date.toLocaleDateString();
  }

  
getImageUrl(imageUrl: string): string {
    if (!imageUrl) {
        return ''; 
    }
    
    if (imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    return `http://192.168.56.16/${imageUrl}`;
}