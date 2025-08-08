import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../../schema/note.schema';
import { CreateNoteDto, UpdateNoteDto } from '../../DTO/note.dto';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) {}

  async create(createNoteDto: CreateNoteDto, userId: string): Promise<Note> {
    const newNote = new this.noteModel({ ...createNoteDto, userId });
    return newNote.save();
  }

  async findAllByUser(userId: string): Promise<Note[]> {
    return this.noteModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Note> {
    const note = await this.noteModel.findOne({ _id: id, userId }).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
    return note;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto, userId: string): Promise<Note> {
    const note = await this.noteModel.findOneAndUpdate(
      { _id: id, userId },
      updateNoteDto,
      { new: true }
    ).exec();
    if (!note) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
    return note;
  }

  async remove(id: string, userId: string): Promise<any> {
    const result = await this.noteModel.deleteOne({ _id: id, userId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
    return { message: 'Note deleted successfully' };
  }
}