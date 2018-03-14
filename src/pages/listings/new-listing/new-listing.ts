import { Component, ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { Listing } from '../../../models/listing/listing.model'

@Component({
  selector: 'page-new-listing',
  templateUrl: 'new-listing.html',
})
export class NewListingPage {
  listing: Listing = new Listing();
  minAvailability: string = moment().format();
  rangeLabelLower: string = this.rangelLabel(this.listing.duration.lower);
  rangeLabelUpper: string = this.rangelLabel(this.listing.duration.upper);
  listingForm: FormGroup;
  @ViewChild(Slides) slides: Slides;
  constructor(private formBuilder: FormBuilder) {
    this.listingForm = this.formBuilder.group({
      title: ['', Validators.required],
      summary: ['', Validators.required],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      private: [this.listing.location.private],
      gender: [this.listing.roommate.gender],
      groupEarly20: [this.listing.roommate.age.groupEarly20],
      groupLate20: [this.listing.roommate.age.groupLate20],
      group30: [this.listing.roommate.age.group30],
      group40older: [this.listing.roommate.age.group40older],
      price: ['', Validators.required],
      deposit: ['', Validators.required],
      availability: [moment(this.listing.availability).format('YYYY-MM-DD'), Validators.required],
      duration: [this.listing.duration, Validators.required]
    });
  }

  prev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  durationChange(): void {
    this.rangeLabelLower = this.rangelLabel(this.listing.duration.lower);
    this.rangeLabelUpper = this.rangelLabel(this.listing.duration.upper);
  }

  private rangelLabel(value: number): string {
    return value < 12 ? `${value} months` : 'Over 1 year';
  }

  ionViewDidLoad() {
    // this.slides.lockSwipes(true);
  }

}
