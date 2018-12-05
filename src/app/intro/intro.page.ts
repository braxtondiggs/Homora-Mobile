import { Component, ViewChild, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Slides } from '@ionic/angular';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  @ViewChild(Slides) slides: Slides;
  isEnd = false;
  constructor(private router: Router) { }

  async ngOnInit() {
    await this.slides.ionSlideDidChange.subscribe(async () => {
      this.isEnd = await this.slides.isEnd();
    });
  }

  gotoMainPage() {
    // this.auth.skipIntro();
    this.router.navigate(['tabs']);
  }

  openAuthPage() {
    this.router.navigate(['auth']);
  }
}
