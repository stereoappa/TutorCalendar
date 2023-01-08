import {Injectable} from '@angular/core'
import {
  concatAll,
  concatMap,
  from,
  map,
  mergeMap,
  Observable,
  of,
  toArray
} from 'rxjs'
import {DocumentReference} from '@angular/fire/compat/firestore'
import {FirestoreService} from '../../core/firestore.service'

export interface Activity {
  id?: string,
  studentId: string,
  student?: StudentSnapshot,
  courseId: string,
  course?: Observable<CourseSnapshot>,
  price: number,
  title: string,
  datekey: number,
}

export interface ActivitySnapshot {
  id?: string,
  student_id: DocumentReference,
  title: string,
  datekey: number,
}

export interface StudentSnapshot {
  id: string,
  name: string
  courses: DocumentReference
}

export interface CourseSnapshot {
  id?: string,
  name: string
  price: number
}

@Injectable({providedIn: 'root'})
export class ActivityClient {
  private readonly students$: Observable<StudentSnapshot>

  private readonly courses$: Observable<CourseSnapshot[]>

  constructor(private firestoreService: FirestoreService) {
    this.students$ = firestoreService.collectionWithIds$<StudentSnapshot>('student').pipe(concatMap(students => from(students)))
    this.courses$ = firestoreService.collection$<CourseSnapshot>('course')
  }

  load(datekeys: number[]): Observable<Activity[]> {
    const minDatekey = datekeys[0]
    const maxDatekey = datekeys[datekeys.length - 1]

    return this.firestoreService.collectionData$<ActivitySnapshot>('activity', ref => ref
      .where('datekey', '>=', minDatekey)
      .where('datekey', '<=', maxDatekey))
      .pipe(
        concatAll(),
        map(this.toActivity),
        mergeMap(activity =>
          this.getStudentById$(activity.studentId)
            .pipe(
              map(student => ({...activity, student})),
            )
        ),
        toArray(),
      )
  }

  create(activity: ActivitySnapshot) {
    const id = activity.id || this.firestoreService.createId()

    this.firestoreService.set<ActivitySnapshot>(`activity/${id}`, activity)
       .then(_ => {
         console.log('saved', _)
       })
  }

  getStudentById$(studentId: string | DocumentReference): Observable<StudentSnapshot> {
    if (!studentId) {
      return of(null)
    }

    return this.firestoreService.docData$<StudentSnapshot>(studentId)
  }

  private toActivity(snapshot: ActivitySnapshot): Activity {
    return {
      courseId: '',
      course: null,
      datekey: snapshot.datekey,
      price: 0,
      studentId: snapshot.student_id?.path,
      student: null,
      title: snapshot.title
    }
  }
}
