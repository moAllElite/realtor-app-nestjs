import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  full_name: string;
  @IsNotEmpty()
  @Matches(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g, {
    message: 'Phone must be a valid phone number',
  })
  phone_number: string;
  @IsNotEmpty()
  @IsEmail()
  @IsString()
  email_address: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password: string;
}
