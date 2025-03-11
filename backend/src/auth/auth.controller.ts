import { Controller, Post, Body, HttpCode, HttpStatus, Res, UseGuards, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log(loginDto)
    const result = await this.authService.login(loginDto);
    console.log(result)
    // Set JWT token in HTTP-only cookie
    response.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return both token and user data
    return {
      token: result.token, // Include token in response for Next-Auth
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(registerDto);
    
    // Set JWT token in HTTP-only cookie
    response.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Return both token and user data
    return {
      token: result.token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @GetUser('_id') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto
  ) {
    try {
      // Validate request body
      if (!updatePasswordDto.currentPassword || !updatePasswordDto.newPassword || !updatePasswordDto.confirmPassword) {
        throw new BadRequestException('All password fields are required');
      }

      // Validate passwords match
      if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
        throw new BadRequestException('New password and confirmation do not match');
      }

      await this.authService.changePassword(userId, updatePasswordDto);
      return { message: 'Password changed successfully' };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to change password');
    }
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    // Clear the JWT cookie
    response.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    // Clear any other session-related cookies if they exist
    response.clearCookie('next-auth.session-token');
    response.clearCookie('__Secure-next-auth.session-token');
    response.clearCookie('__Host-next-auth.session-token');

    return { message: 'Logged out successfully' };
  }
} 