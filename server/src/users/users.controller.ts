import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    private readonly usersService: UsersService;

    public constructor(usersService: UsersService) {
        this.usersService = usersService;
    }

    // Yeni kullanıcı oluşturma
    @Post()
    public create(@Body() createUserDto: any) {
        return this.usersService.create(createUserDto);
    }

    // Kullanıcı detayı görüntüleme
    @Get(':id')
    public findOne(@Param('id') id: string) {
        return this.usersService.findOne(+id);
    }

    // Kullanıcı güncelleme
    @Patch(':id')
    public update(@Param('id') id: string, @Body() updateUserDto: any) {
        return this.usersService.update(+id, updateUserDto);
    }

    // Kullanıcı silme
    @Delete(':id')
    public remove(@Param('id') id: string) {
        return this.usersService.remove(+id);
    }
} 