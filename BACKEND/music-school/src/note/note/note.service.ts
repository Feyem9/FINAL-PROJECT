import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from '../../schema/note.schema';
import { CreateNoteDto, UpdateNoteDto } from '../../DTO/note.dto';

@Injectable()
export class NoteService {
  private readonly logger = new Logger(NoteService.name);

  constructor(@InjectModel(Note.name) private noteModel: Model<NoteDocument>) { }

  /**
   * Create a new note for a user
   * @param createNoteDto Note data transfer object
   * @param authorId The user identifier
   * @returns Newly created note
   */
  async create(createNoteDto: CreateNoteDto, authorId: string): Promise<Note> {
    this.logger.log(`Creating new note for user ${authorId}`);
    // Use authorId from DTO instead of parameter
    const newNote = new this.noteModel({ ...createNoteDto });
    return newNote.save();
  }

  /**
   * Find all notes for a specific user
   * @param authorId The user identifier
   * @returns Array of notes belonging to the user
   */
  async findAllByUser(authorId: string): Promise<Note[]> {
    this.logger.log(`Fetching all notes for user ${authorId}`);
    return this.noteModel.find({ authorId }).sort({ createdAt: -1 }).exec();
  }

  /**
   * Find a specific note by ID for a user
   * @param id Note identifier
   * @param authorId User identifier
   * @returns The requested note
   * @throws NotFoundException if note doesn't exist
   */
  async findOne(id: string, authorId: string): Promise<Note> {
    this.logger.log(`Fetching note <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>d</mi></mrow><mi>f</mi><mi>o</mi><mi>r</mi><mi>u</mi><mi>s</mi><mi>e</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{id} for user </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal" style="margin-right:0.02778em;">or</span><span class="mord mathnormal">u</span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span></span></span></span>{authorId}`);
    const note = await this.noteModel.findOne({ _id: id, authorId }).exec();
    if (!note) {
      this.logger.warn(`Note with ID "<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>d</mi></mrow><mi mathvariant="normal">&quot;</mi><mi>n</mi><mi>o</mi><mi>t</mi><mi>f</mi><mi>o</mi><mi>u</mi><mi>n</mi><mi>d</mi><mi>f</mi><mi>o</mi><mi>r</mi><mi>u</mi><mi>s</mi><mi>e</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{id}&quot; not found for user </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span></span><span class="mord">&quot;</span><span class="mord mathnormal">n</span><span class="mord mathnormal">o</span><span class="mord mathnormal">t</span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal">o</span><span class="mord mathnormal">u</span><span class="mord mathnormal">n</span><span class="mord mathnormal" style="margin-right:0.10764em;">df</span><span class="mord mathnormal" style="margin-right:0.02778em;">or</span><span class="mord mathnormal">u</span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span></span></span></span>{authorId}`);
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
    return note;
  }

  /**
   * Update a note
   * @param id Note identifier
   * @param updateNoteDto Updated note data
   * @param authorId User identifier
   * @returns Updated note
   * @throws NotFoundException if note doesn't exist
   */
  async update(id: string, updateNoteDto: UpdateNoteDto, authorId: string): Promise<Note> {
    this.logger.log(`Updating note <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>d</mi></mrow><mi>f</mi><mi>o</mi><mi>r</mi><mi>u</mi><mi>s</mi><mi>e</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{id} for user </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal" style="margin-right:0.02778em;">or</span><span class="mord mathnormal">u</span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span></span></span></span>{authorId}`);
    const note = await this.noteModel.findOneAndUpdate(
      { _id: id, authorId },
      updateNoteDto,
      { new: true, runValidators: true }
    ).exec();
    if (!note) {
      this.logger.warn(`Note with ID "<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>d</mi></mrow><mi mathvariant="normal">&quot;</mi><mi>n</mi><mi>o</mi><mi>t</mi><mi>f</mi><mi>o</mi><mi>u</mi><mi>n</mi><mi>d</mi><mi>f</mi><mi>o</mi><mi>r</mi><mi>u</mi><mi>s</mi><mi>e</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{id}&quot; not found for user </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span></span><span class="mord">&quot;</span><span class="mord mathnormal">n</span><span class="mord mathnormal">o</span><span class="mord mathnormal">t</span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal">o</span><span class="mord mathnormal">u</span><span class="mord mathnormal">n</span><span class="mord mathnormal" style="margin-right:0.10764em;">df</span><span class="mord mathnormal" style="margin-right:0.02778em;">or</span><span class="mord mathnormal">u</span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span></span></span></span>{authorId} during update`);
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
    return note;
  }

  /**
   * Remove a note
   * @param id Note identifier
   * @param authorId User identifier
   * @returns Success message
   * @throws NotFoundException if note doesn't exist
   */
  async remove(id: string, authorId: string): Promise<{ message: string }> {
    this.logger.log(`Removing note <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>d</mi></mrow><mi>f</mi><mi>o</mi><mi>r</mi><mi>u</mi><mi>s</mi><mi>e</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{id} for user </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal" style="margin-right:0.02778em;">or</span><span class="mord mathnormal">u</span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span></span></span></span>{authorId}`);
    const result = await this.noteModel.deleteOne({ _id: id, authorId }).exec();
    if (result.deletedCount === 0) {
      this.logger.warn(`Note with ID "<span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>d</mi></mrow><mi mathvariant="normal">&quot;</mi><mi>n</mi><mi>o</mi><mi>t</mi><mi>f</mi><mi>o</mi><mi>u</mi><mi>n</mi><mi>d</mi><mi>f</mi><mi>o</mi><mi>r</mi><mi>u</mi><mi>s</mi><mi>e</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{id}&quot; not found for user </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span></span><span class="mord">&quot;</span><span class="mord mathnormal">n</span><span class="mord mathnormal">o</span><span class="mord mathnormal">t</span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal">o</span><span class="mord mathnormal">u</span><span class="mord mathnormal">n</span><span class="mord mathnormal" style="margin-right:0.10764em;">df</span><span class="mord mathnormal" style="margin-right:0.02778em;">or</span><span class="mord mathnormal">u</span><span class="mord mathnormal" style="margin-right:0.02778em;">ser</span></span></span></span>{authorId} during removal`);
      throw new NotFoundException(`Note with ID "${id}" not found`);
    }
    return { message: 'Note deleted successfully' };
  }
}
