import { Component, OnInit } from '@angular/core';
import { CourseService } from '../shared/services/course.service';
import { AuthenticationService } from "../shared/authentication-service";
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { course } from '../shared/course';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  courses: Observable<any[]>;
  
  booking = {};
  
  //public courseList: Observable<>
  //public authService: AuthenticationService
  constructor(
    public authService: AuthenticationService,
    private courseService: CourseService,
    //public firestore: AngularFirestore
    ) {
      //this.courses = this.firestore.collection('courses').valueChanges();
    }
  
  ngOnInit() {
    /* this.courseService.getCourses().subscribe(res =>{
      console.log('Our courses :',res);
    });*/
    this.courses = this.courseService.getCourses();
   /* this.courseService.booking.subscribe(value => {
      console.log('MY BOOKING LIST NOW :', value);
      this.booking = value;   
    });*/
  }


}