import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CalenderDto } from 'src/DTO/calender.dto';
import { CalenderService } from './calender.service';

@Controller('calender')
export class CalenderController { 

    constructor(private readonly calenderService: CalenderService) {}
    // --------------------------------
    // SECTION 1 : CRUD     
    // --------------------------------    
    @Post('/create')
    async createCalender(@Body() calenderDto: CalenderDto) {
        return await this.calenderService.createCalender(calenderDto);
    } 
    @Get('/all')
    async getAllCalenders() {
        return await this.calenderService.getAllCalenders();
    }
    @Get('/:id')
    async getOneById(@Param('id') calenderId: string) {
        return await this.calenderService.getOneById(calenderId);
    }
    @Put('/:id')
    async updateCalender(@Param('id') calenderId: string, @Body() calenderDto: CalenderDto) {
        return await this.calenderService.updateCalender(calenderId, calenderDto);
    }
    @Delete('/:id')
    async deleteCalender(@Param('id') calenderId: string) {
        return await this.calenderService.deleteCalender(calenderId);
    }
}
