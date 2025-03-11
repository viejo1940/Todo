import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @MinLength(8, { message: 'Current password must be at least 8 characters long' })
  currentPassword: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  @MaxLength(32, { message: 'New password must not exceed 32 characters' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,
    { message: 'New password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number or special character' }
  )
  newPassword: string;

  @IsString()
  @MinLength(8, { message: 'Password confirmation must be at least 8 characters long' })
  confirmPassword: string;
} 