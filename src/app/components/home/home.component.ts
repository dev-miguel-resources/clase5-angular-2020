import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, query, stagger, animate, style } from '@angular/animations';
import {take} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


//SERVICES 
import { Subject, Subscription } from 'rxjs';
import { MovieService } from 'src/app/services/movie.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':leave', [
          stagger(100, [
            animate('0.5s', style({ opacity: 0 }))
          ])
        ], { optional: true }),
        query(':enter', [
          style({ opacity: 0 }),
          stagger(100, [
            animate('0.5s', style({ opacity: 1 }))
          ])
        ], { optional: true })
      ])
    ])
  ],
})
export class HomeComponent implements OnInit, OnDestroy {

  //DECLARACIONES
  public viewCount = 9;
  public page = 0;
  public pageSize = 9;
  public previousPage = 0;
  public movies = [];
  public moviesStorage = [];
  public objectMovie:any;
  public subscriptionSearchData: Subscription;
  private componentDestroyed: Subject<boolean> = new Subject();
  public message = null;

  constructor(
      private movieService:MovieService,
      private router:ActivatedRoute
  ) {
      this.subscriptionSearchData = this.movieService.observableSearchData$
      .subscribe(
        dataSearch => {
          if(dataSearch){
            this.getDataSearch(dataSearch);
          }
        });
   }

  ngOnInit() {
    this.router.params.subscribe(routeParams =>{
      this.getPopular(routeParams.category);
    });
  }

  ngOnDestroy():void {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
    this.subscriptionSearchData.unsubscribe();
  }

  public changeViewMovie(){
    this.movies = [];
    this.movies = this.moviesStorage.slice(0, this.viewCount);
  }

  public getPopular(category:string){
    this.movies = [];
    this.movieService.getPopular(category)
      .pipe(
        take(1)
      )
      .subscribe(
        res => {
          this.moviesStorage = res.results;
          this.movies = res.results.slice(0, this.viewCount);
          console.log(this.movies);
        },
        err => {
          console.log(err);
        },
        () => {
          //PETICIÓN FINALIZADA
        });
  }

  public getDataSearch(search:string){
    this.movies = [];
    this.movieService.getSearch(search)
      .pipe(
        take(1)
      )
      .subscribe(
        res => {
          if(res.results.length === 0){
            this.message = 'No existen resultados para tú búsqueda';
          }
          this.moviesStorage = res.results;
          this.movies = res.results.slice(0, this.viewCount);
        },
        err => {
          console.log(err);
        },
        () => {
          //PETICIÓN YA FUE FINALIZADA
        });
  }



}
