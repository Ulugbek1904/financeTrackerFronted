import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../../core/services/profile.service';
import { DialogModule } from 'primeng/dialog';
import { Button, ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ CardModule, FormsModule, DialogModule, ButtonModule, ToastModule, NgIf ],
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.css'],
  providers: [MessageService]
})
export class ProfilePageComponent implements OnInit {
  profileImageUrl = '';
  userName = '';
  showImageModal: boolean = false;
  newImageFile: File | null = null;
  email = '';
  reEnterPassword = '';
  errors: { [key: string]: string } | null = null;
  isSubmitting = false;

  passwordDto = { oldPassword: '', newPassword: '' };
  profileDto = { firstName: '', lastName: '' };

  userService = inject(UserService);
  profileService = inject(ProfileService);
  messageService = inject(MessageService);

  ngOnInit() {
    this.userService.getMe().subscribe({
      next: user => {
        if(user.profilePictureUrl){
          this.profileImageUrl = user.profilePictureUrl;
        }
        this.userName = `${user.firstName} ${user.lastName}`;
        this.email = user.email;
      },
      error: err => {
        console.log("Foydalanuvchi ma'lumotlarini olishda xatolik",err)
      }
    })
  }

  openImageModal() {
    this.showImageModal = true;
  }
  onFileSelected(event: any) {
    this.newImageFile = event.target.files[0];
  }
  saveImage() {
    if (this.newImageFile) {
      this.profileService.uploadPicture(this.newImageFile).subscribe({
        next: (response) => {
          this.userService.getMe().subscribe({
            next: user => {
              if(user.profilePictureUrl){
                this.profileImageUrl = user.profilePictureUrl.replace('http', 'https')
              }
            }
          })
          this.showImageModal = false;
          this.newImageFile = null;
        },
        error: (err) => {
          console.log("Rasmni yuklashda xatolik", err);
        }
      });
    }
  }
  cancelImage() {
    this.showImageModal = false;
    this.newImageFile = null;
  }
  changePassword() {
    this.errors = null;
    this.isSubmitting = true;

    if (this.passwordDto.newPassword !== this.reEnterPassword) {
      this.errors = { reEnterPassword: 'Passwords do not match' };
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Passwords do not match'
      });
      this.isSubmitting = false;
      return;
    }

    this.profileService
      .changePassword(this.passwordDto.oldPassword, this.passwordDto.newPassword)
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Password changed successfully'
          });
          this.passwordDto = { oldPassword: '', newPassword: '' };
          this.reEnterPassword = '';
        },
        error: (err) => {
          this.isSubmitting = false;
          this.handleError(err);
        }
      });
  }

  private handleError(err: any) {
    this.errors = {};
    if (err.status === 401) {
      this.errors['OldPassword'] = 'Old password is incorrect';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.errors['OldPassword']
      });
      this.passwordDto = { oldPassword: '', newPassword: '' };
      this.reEnterPassword = '';
    } else if (err.status === 400) {
      this.errors['NewPassword'] =
        err.error.errors.NewPassword[0] || 'New password is invalid';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.errors['NewPassword']
      });
      this.passwordDto = { oldPassword: '', newPassword: '' };
      this.reEnterPassword = '';
    } else {
      // Umumiy xatolik
      this.errors['general'] = 'An error occurred. Please try again later.';
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: this.errors['general']
      });
    }
  }

  updateProfile() {
    this.profileService.updateProfile(this.profileDto.firstName, this.profileDto.lastName).subscribe({
      next: () => {
        console.log("Profil muvaffaqiyatli yangilandi")
        this.profileDto = { firstName: '', lastName: '' };
        this.userService.getMe().subscribe({
          next: user => {
            this.userName = `${user.firstName} ${user.lastName}`;
          }
        })
      },
      error: (err) => console.log("Profilni yangilashda xatolik", err)
    });
  }
}