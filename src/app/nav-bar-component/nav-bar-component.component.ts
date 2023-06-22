import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfessorAndTaService } from '../professor-and-ta.service';
import { StudentsService } from '../students.service';

@Component({
  selector: 'app-nav-bar-component',
  templateUrl: './nav-bar-component.component.html',
  styleUrls: ['./nav-bar-component.component.css']
})
export class NavBarComponentComponent {
 
  searchQuery: any;
  searchResults!: any[];
  isStudent: any;
  name:any
  isLog:boolean=false;

  constructor(private router: Router,private route: ActivatedRoute,
    private profAndTa:ProfessorAndTaService ,
    private http: HttpClient,
    private _AuthService:AuthService,
    private studendService: StudentsService) {}
 
    ngOnInit(): void {
      const token=this._AuthService.getToken();
      if(this._AuthService.getToken()){
        this.isLog=true;
        
      } else{
        this.isLog=false;
      }
      this.profAndTa.getUserType(token).subscribe((type:any ) => {
      if(type[0].Type==="Professor" ){
        this.isStudent=false;
        this.profAndTa.getProfessorInfo(token).subscribe((profInfo:any ) => {
          this.name=profInfo[0].professorName

        });
      }
      else if(type[0].Type==="TA"){
        this.isStudent=false;
        this.profAndTa.getTAInfo(token).subscribe((TaInfo:any ) => {
          this.name=TaInfo[0].TAName

        });
      }
      else if(type[0].Type==="Student"){
        this.isStudent=true;
        this.studendService.getStudentInfo(token).subscribe((StudentInfo:any ) => {
          this.name=StudentInfo[0].studentName

        });
    
      }
    
    });
    }
    logout()
    {
      const token=this._AuthService.getToken();
      this._AuthService.removeToken();
    }
      
  searchUsers() {
    this.http.get<any[]>('http://127.0.0.1:8000/api/searchByStudent?q=' + this.searchQuery)
      .subscribe((results) => {
        console.log("this.searchQuery",this.searchQuery)
        this.searchResults = results;
        console.log("Result",results)
      }, (error) => {
        console.error(error);
      });
  }

  goToUserProfile(studentInfo: any) {
    console.log('studentInfo',studentInfo)
    this.router.navigate(['ViewStudentProfile'],{ queryParams: studentInfo  });
  }
  goToProfile() {
    
    const token=this._AuthService.getToken();
      this.profAndTa.getUserType(token).subscribe((type:any ) => {
      if(type[0].Type==="Professor" ||type[0].Type==="TA"){
        this.router.navigate(['ProfProfile']);
      }
      else if(type[0].Type==="Student"){
        this.router.navigate(['profile']);
      }
    
    });
    
  }
  navigateHome(){

    const token=this._AuthService.getToken();

    this.profAndTa.getUserType(token).subscribe((type:any ) => {
      console.log("type=",type[0].Type)
    if(type[0].Type==="Professor" ||type[0].Type==="TA"){
      this.router.navigate(['home_dr_ta']);
    }
    else if(type[0].Type==="Student"){
      this.router.navigate(['home_login']);
    }
  
  });

  }

}
