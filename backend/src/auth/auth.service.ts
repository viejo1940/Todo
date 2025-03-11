import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdatePasswordDto } from '../users/dto/update-password.dto';
import { UserDocument } from '../users/schemas/user.schema';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    try {
      const user = await this.usersService.validateUser(email, password);
      return user;
    } catch (error) {
      if (error.message === 'User not found') {
        throw new UnauthorizedException('Invalid email address');
      } else if (error.message === 'Invalid password') {
        throw new UnauthorizedException('Invalid password');
      }
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const token = this.jwtService.sign(payload);

    return {
      token,
      user: {
        id: user._id.toString(),
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    try {
      const user = await this.usersService.create(registerDto);
      
      const payload = {
        sub: user._id,
        email: user.email,
        role: user.role,
      };

      const token = this.jwtService.sign(payload);

      return {
        token,
        user: {
          id: user._id.toString(),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      };
    } catch (error) {
      if (error.code === 11000) { // MongoDB duplicate key error
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async changePassword(userId: string, updatePasswordDto: UpdatePasswordDto): Promise<void> {
    try {
      await this.usersService.updatePassword(userId, updatePasswordDto);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException(error.message);
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  // Helper method to generate JWT token
  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }
} 