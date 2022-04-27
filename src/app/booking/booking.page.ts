import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { CourseService } from '../shared/services/course.service';
import { AlertController, ToastController } from '@ionic/angular';
import { course } from '../shared/course';
import { async } from '@firebase/util';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {
 ///courses: Observable<any[]>;
  public selectedcourse: any;//any
  courseName: any;
  coursePrice: any;
  courseImage: any;
  email: string;
  param: string;
  description: any;
  passedId: any;
  availability: any;
  
  //items: Observable<any[]>;
  constructor(
    private route: ActivatedRoute,
    private router: Router,  
    private firestore: AngularFirestore,  /////////////
    public alertController: AlertController,
    private courseService: CourseService,
    private toast: ToastController) { 
     /// this.passedId=+ this.route.snapshot.params['courseID'];    //id
     ///////this.param = this.route.snapshot.paramMap.get("courseName")
      //this.items = this.firestore.collection('courses').valueChanges();
    }

  selectedCrs?: course;
  onSelect(crs: course): void {
  this.selectedCrs = crs;
  this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to book this course ?',
      buttons: [{
          text: 'No',
          handler: () => {
            console.log('You cancelled the booking');
          }
        },
        { text: 'Yes ',handler:  async (value) => {
         // if(this.addToBookingList === undefined) {return}
            let data = {
              courseName: this.selectedCrs.courseName,
              coursePrice: this.selectedcourse.coursePrice,
            //  courseID: this.selectedcourse.courseID,
              description: this.selectedcourse.description
            }
            
            this.courseService.saveCourse(data)
           // this.courseService.addToBookingList(id)

            .then(res =>{
                this.router.navigate(['/recap',crs]);
              })
            
            console.log('Congratulations on booking this course !');
            
              const toast = await this.toast.create({
              message: 'Congratulations on booking this course !',
              duration: 3000,
              });
              toast.present();
            }
        }
      ]
    
  }).then(res => {
      res.present();
     });
  }

 /* async Toast(){
    const toast = await this.toast.create({
    message: 'Congratulations on booking this course !',
    duration: 3000,
  });
  toast.present();
  }*/

  ngOnInit() {
    this.selectedcourse = this.route.snapshot.params
   /* this.firestore.collection('courses').snapshotChanges(['added'])
    .subscribe(actions => {
       actions.forEach(action => {

         if (this.passedId == action.payload.doc.data()['courseID']) {
           this.courseName = action.payload.doc.data()['courseName'];
           this.description = action.payload.doc.data()['description'];
           this.coursePrice = action.payload.doc.data()['coursePrice'];
          // this.courseId = action.payload.doc.data()['courseId'];
           this.courseImage = action.payload.doc.data()['courseImage'];
           this.availability = action.payload.doc.data()['availability'];
          }
       });
    });*/
  }

  addToBookingList(event, course){
    event.stopPropagation();
    this.courseService.addToBookingList(course.courseID);//id
  }

  removeFromBookingList(event, course){
    event.stopPropagation();
    this.courseService.removeFromBookingList(course.courseID);
  }

  /*addToBookingList(){
    this.firestore.collection("booking list").add({
    	title: this.courseTitle,
      price: this.coursePrice,
      image: this.courseImage
    });
    this.router.navigate(["recap"]);
  }*/
}
