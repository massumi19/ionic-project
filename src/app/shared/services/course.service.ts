import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import firebase from 'firebase/compat/app';
import  'firebase/firestore'
import { Plugins } from '@capacitor/core' //or ionic storage
//import { collection, doc, Firestore, setDoc } from 'firebase/firestore';
import { AuthenticationService } from '../authentication-service';
import { course } from '../course';
const {Storage} = Plugins;
//import { Storage } from '@capacitor/storage';
// NEW
//import { AnyPlugin } from 'any-plugin';



const BOOKING_STORAGE_KEY ='MY_KEY';  
//for the availability field
const INCREMENT = firebase.firestore.FieldValue.increment(1);
const DECREMENT = firebase.firestore.FieldValue.increment(-1);

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  coursesCollection: AngularFirestoreCollection;
  booking = new BehaviorSubject({}); //betR th observabls ?
  bookingKey= null;

  constructor(private afs : AngularFirestore,
    public authService: AuthenticationService,
    //private firestore: Firestore
    ) {
    this.coursesCollection = this.afs.collection('courses');
  //  this.loadBookings;
  }

  getCourses(){ 
   return this.coursesCollection.valueChanges({idField:'id'});
   //return firebase.firestore().collection('courses').get();
  }


  async loadBookings(){
    const result = await Storage.get({key : BOOKING_STORAGE_KEY});
    console.log('booking from storage', result);
    
    if(result.value){
      //already have a booking
      this.bookingKey = result.value;

      this.afs.collection('booking list').doc(this.bookingKey).valueChanges().subscribe((result: any) => {
        delete result['lastUpdate'];
        console.log('booking list changed', result);
        this.booking.next(result || {});
      });
    }

    else {
      const fbDocument = await this.afs.collection('booking list').add({
        lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
      });
        console.log('new booking list', fbDocument);
        this.bookingKey = fbDocument.id;
        await Storage.set({ key : BOOKING_STORAGE_KEY, value: this.bookingKey});
    }
  }

  saveCourse(value){
    return new Promise<any>((resolve,reject)=>{
      let currentUser = this.authService.userData;
     // .collection('users').doc(currentUser.uid)
      this.afs.collection('users').doc(currentUser.uid).collection('booking list').add({
        courseName : value.courseName,
        coursePrice: value.coursePrice,
        description: value.description
      }).then(
        res => resolve(res),
        err => reject(err)
      )
    })
  }
 
 /* saveeCourse(crs: course): Promise<void> {
    const document = doc(collection(this.firestore, 'booking list'));
    return setDoc(document, crs);
   }*/

  addToBookingList(id){
    this.afs.collection('booking list').doc(this.bookingKey).update({
      [id]: INCREMENT,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    });
    this.coursesCollection.doc(id).update({
      availability: DECREMENT
    });
  }
  removeFromBookingList(id){
    /*this.afs.collection('booking list').doc(this.bookingKey).update({
      [id]: DECREMENT,
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    });*/
    this.coursesCollection.doc(id).update({
      availability: INCREMENT
    });
  }

  async checkoutBooking(){
    await this.afs.collection('booking orders').add(this.booking.value);
    this.afs.collection('booking list').doc(this.bookingKey).set({
      lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
    });
  }
}
