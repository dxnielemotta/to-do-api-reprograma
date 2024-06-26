import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';

@Controller('tasks')
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @Post('criar')
  createTask(@Body() body: { titulo: string; descricao: string }) {
    const task = this.taskService.createTask(body.titulo, body.descricao);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Task criada com sucesso',
      data: task,
    };
  }

  @Get()
  getAll() {
    const tasks = this.taskService.getAllTasks();
    return {
      statusCode: HttpStatus.OK,
      message: 'Todas as tasks retornadas com sucesso',
      data: tasks,
    };
  }

  @Get(':id')
  getTaskById(@Param('id') id: string) {
    const task = this.taskService.getTaskById(id);

    if (!task) {
      throw new HttpException(
        'Não foi possível encontrar a task',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'Task retornada com sucesso',
      data: task,
    };
  }

  @Delete(':id')
  deleteById(@Param('id') id: string) {
    this.taskService.deleteTaskById(id);
    return {
      statusCode: HttpStatus.NO_CONTENT,
      message: 'Task deletada com sucesso',
    };
  }

  @Put(':id')
  updateTask(
    @Param('id') id: string,
    @Body()
    body: { titulo: string; descricao: string; status: 'PENDENTE' | 'FEITA' },
  ) {
    const task = this.taskService.updateTask(
      id,
      body.titulo,
      body.descricao,
      body.status,
    );

    if (!task) {
      //erro no insomnia
      throw new HttpException('Task não encontrada', HttpStatus.NOT_FOUND);
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Task atualizada com sucesso',
    };
  }

  @Patch('/edit/:id')
  patchTask(@Param('id') id: string, @Query() updates: Partial<Task>) {
    const task = this.taskService.patchTask(id, updates);
    return {
      statusCode: HttpStatus.OK,
      message: 'Task atualizada com sucesso',
    };
  }
}
