import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  OnInit,
  signal,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import {
  MatOptionModule,
} from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { TextFieldModule } from "@angular/cdk/text-field";
import { TranslocoModule, TranslocoService } from "@ngneat/transloco";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { UserService } from "app/core/user/user.service";
import { User } from "app/core/user/user.types";
import { LocalSession} from "app/shared/core/domain/models/session.model";
import { UserModel } from "app/shared/core/domain/models/account.model";
import { LocalStorageService } from "app/shared/core/domain/services/local_storage.service";
import { environment } from "environments/environment";
import { AccountService } from "app/shared/core/domain/services/account.service";
@Component({
  selector: "settings-account",
  templateUrl: "./account.component.html",
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  //   providers: [provideNativeDateAdapter()],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    TextFieldModule,
    TranslocoModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
})
export class SettingsAccountComponent implements OnInit {
  @ViewChild("avatarFileInput") private _avatarFileInput: ElementRef;

  pictureUrl: any;
  file: any;
  isSaving = signal<boolean>(false);
  disableAllFieldInput = signal<boolean>(true);

  userForm: UntypedFormGroup;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  user: UserModel;
  _loggedInUser: User;
  activeLang: string = "";
  disableLang: string | any = "";
  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private _translocoService: TranslocoService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _userService: UserService,
    private _accountService: AccountService,
    private _localStorage:LocalStorageService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  userAccount = computed(()=>this._accountService.account());

  /**
   * On init
   */
  ngOnInit(): void {
    // Create the form
    // Create the form
    try {
      // this.activeLang = this._translocoService.getActiveLang();
      // let allLangs = this._translocoService.getAvailableLangs();
      // if (Array.isArray(allLangs)) {
      //   this.disableLang =
      //     allLangs.find((lang) => lang["id"] !== this.activeLang) || "";
      //   this.disableLang = this.disableLang.id;
      // } else {
      //   this.disableLang = ""; // Default to an empty string or handle as needed
      // }

      //this.logger.info("User landed on user profile page");
      //this.logger.info("Fetching user profile data");
    

      this._loggedInUser = this._localStorage.get(environment.sessionKey).user;

      let currentID: string = this._loggedInUser ? this._loggedInUser?.id : "";
      this.initailizeForm();
      this.patchForm(this.userAccount());
  }catch(error){
    console.error("Error in fetching user profile data", error);
  }
}

  initailizeForm(){
    this.userForm = this._formBuilder.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      role: ["", Validators.required],
      position: ["", Validators.required],
      email: ["", [Validators.email]],
      phone: ["", Validators.required],
      picture: [""],
      dateJoined: [""],
      country: [""],
      region: [""],
      subRegion: [""],
      branch: [""],
      vacation: [""],
      supervisor: [""],
    });
  }

  patchForm(user:UserModel){
    const name = user.title.split(" ");
    this.userForm.patchValue({
      firstName: name[0],
      lastName: name[1]??'',
      role: user.role.title,
      email: user.email,
      phone: user.phone,
      picture: user.photo,
    });
  }

  updateUploadStatus() {
    this.isSaving.update((state) => !state);
  }

  updateAccount() {
    this.updateUploadStatus();
    // const personnel: Personnel = {
    //   ...this.personnel,
    //   preview: preview,
    // };
    // this._facadeService.updateProfile(personnel).subscribe((res) => {
    //   //this.logger.info("Update personnel successfully", res);
    //   this.updateUploadStatus();

    //   const form = this.personnelForm.getRawValue();

    //   let user: User = {
    //     id: this.personnel.id,
    //     name: `${form.firstName} ${form.lastName}`,
    //     status: personnel.status,
    //     role: form.role,
    //     position: form.position,
    //     email: this.personnel.email,
    //     avatar: this.pictureUrl,
    //   };

    //   this._userService.user = user;
    //   const session = this._localStorage.get(CONSTANTS.LOGGED_IN_USER);
    //   this._localStorage.set(CONSTANTS.LOGGED_IN_USER, {
    //     ...session,
    //     photo: this.pictureUrl,
    //   });
    // });
  }

  /**
   * Upload avatar
   *
   * @param fileList
   */
  uploadAvatar(fileList: FileList): void {
    // Return if no file was selected
    if (!fileList.length) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const file = fileList[0];

    // Return if the file type is not allowed
    if (!allowedTypes.includes(file.type)) {
      return;
    }

    this.file = file;
    // Create a FileReader to read the file as a data URL
    const reader = new FileReader();
    reader.onload = () => {
      this.pictureUrl = reader.result as string;
      this._changeDetectorRef.markForCheck();
    };

    // Read the file
    reader.readAsDataURL(file);

    // Upload the avatar
    // if (this.personnel.photo) {
    //     this._facadeService.updateAvatar(this.personnel, file).subscribe(() => {
    //         this._snackBar.open("Profile picture has been updated.", "Close", {
    //             duration: 3000, // Display snackbar for 5 seconds
    //         });
    //     });
    //     //this.toggleEditMode(false);
    // } else {
    //     this._facadeService.addAvatar(this.personnel, file).subscribe(() => {
    //         this._snackBar.open("Profile picture has been updated.", "Close", {
    //             duration: 3000, // Display snackbar for 5 seconds
    //         });
    //     });
    //     // this.toggleEditMode(false);
    // }
    //this.account.picture=
  }

  removeAvatar(): void {
    // Get the form control for 'avatar'
    // const avatarFormControl = this.personnelForm.get('avatar');

    // // Set the avatar as null
    // avatarFormControl.setValue(null);

    // Set the file input value as null
    this._avatarFileInput.nativeElement.value = null;
    this.pictureUrl = null;
    this.user.photo = null;
    this.file = null;

    // Update the contact
    // this.contact.avatar = null;
  }

  /**
   * Track by function for ngFor loops
   *
   * @param index
   * @param item
   */
  trackByFn(index: number, item: any): any {
    return item.id || index;
  }
}
