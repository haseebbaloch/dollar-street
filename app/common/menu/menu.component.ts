import { Component, Input, OnInit, OnDestroy, HostListener, Inject, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router-deprecated';
import { Observable } from 'rxjs/Observable';
import { SocialShareButtonsComponent } from '../social_share_buttons/social-share-buttons.component.ts';

let tpl = require('./menu.template.html');
let style = require('./menu.css');

@Component({
  selector: 'main-menu',
  template: tpl,
  styles: [style],
  directives: [SocialShareButtonsComponent, RouterLink]
})

export class MainMenuComponent implements OnInit, OnDestroy {
  protected isOpenMenu:boolean = false;
  @Input()
  private hoverPlace:Observable<any>;
  private hoverPlaceSubscribe:any;
  private element:ElementRef;
  private router:Router;

  public constructor(@Inject(Router) router:Router,
                     @Inject(ElementRef) element:ElementRef) {
    this.element = element;
    this.router = router;
  }

  public ngOnInit():void {
    this.hoverPlaceSubscribe = this.hoverPlace && this.hoverPlace.subscribe(() => {
        if (this.isOpenMenu) {
          this.isOpenMenu = false;
        }
      });
  }

  public ngOnDestroy():void {
    if (this.hoverPlaceSubscribe) {
      this.hoverPlaceSubscribe.unsubscribe();
    }
  }

  protected switchOnOnboardingFromMenu():void {
    let ifOnMatrixPage = this.router.hostComponent.name === 'MatrixComponent';

    if (ifOnMatrixPage) {
      window.localStorage.removeItem('onboarded');
      location.reload();
    }
    window.localStorage.removeItem('onboarded');
    this.router.navigate(['Matrix']);
  }

  @HostListener('document:click', ['$event'])
  public isOutsideMainMenuClick(event:Event):void {
    if (!this.element.nativeElement.contains(event.target) && this.isOpenMenu) {
      this.isOpenMenu = false;
    }
  }
}
