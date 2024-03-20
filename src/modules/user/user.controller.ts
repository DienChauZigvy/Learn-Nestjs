import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
    @Get('/abc') //localhost:3000/user/abc
    getUser(){
        return 'user 1'
    }
}
