import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import {UpdateUserDto} from "./dto/update-user.dto";

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    private readonly usersService: UsersService;

    public constructor(usersService: UsersService) {
        this.usersService = usersService;
    }

    @Post()
    public async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return await this.usersService.create(createUserDto);
    }

    @Get(':id')
    public async findOne(@Param('id') id: string): Promise<UserResponseDto> {
        return await this.usersService.findOne(+id);
    }

    @Patch(':id')
    public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        return await this.usersService.update(+id, updateUserDto);
    }

    @Delete(':id')
    public async remove(@Param('id') id: string): Promise<void> {
        await this.usersService.remove(+id);
    }
} 