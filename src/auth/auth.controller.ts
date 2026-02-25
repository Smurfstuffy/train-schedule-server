import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already registered' })
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto.email, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: AuthDto })
  @ApiResponse({ status: 201, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto.email, dto.password);
  }
}
