import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Request,
    Headers,
    UnauthorizedException,
    Logger,
    HttpStatus,
    HttpCode
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto, UpdateNoteDto } from '../../DTO/note.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('notes')
@Controller('notes')
export class NoteController {
    private readonly logger = new Logger(NoteController.name);

    constructor(private readonly noteService: NoteService) { }

    /**
     * Create a new note
     */
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Create a new note' })
    @ApiHeader({ name: 'x-author-id', description: 'Author ID', required: true })
    @ApiBody({ type: CreateNoteDto })
    @ApiResponse({ status: 201, description: 'The note has been successfully created.' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Author ID is missing.' })
    async create(@Body() createNoteDto: CreateNoteDto, @Headers('x-author-id') authorId: string) {
        this.validateAuthorId(authorId);
        // Verify that the authorId in the header matches the authorId in the DTO
        if (createNoteDto.authorId !== authorId) {
            this.logger.warn(`Author ID mismatch: header=${authorId}, dto=${createNoteDto.authorId}`);
            throw new UnauthorizedException('Author ID mismatch');
        }
        this.logger.log(`Creating new note for author ${authorId}`);
        return this.noteService.create(createNoteDto, authorId);
    }

    /**
     * Get all notes for a user
     */
    @Get('/all')
    @ApiOperation({ summary: 'Find all notes for the current author' })
    @ApiHeader({ name: 'x-author-id', description: 'Author ID', required: true })
    @ApiResponse({ status: 200, description: 'Return all notes belonging to the author.' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Author ID is missing.' })
    async findAllByUser(@Headers('x-author-id') authorId: string) {
        this.validateAuthorId(authorId);
        this.logger.log(`Fetching all notes for author ${authorId}`);
        return this.noteService.findAllByUser(authorId);
    }

    /**
     * Get a specific note by ID
     */
    @Get('/:id')
    @ApiOperation({ summary: 'Find a note by ID' })
    @ApiParam({ name: 'id', description: 'Note ID' })
    @ApiHeader({ name: 'x-author-id', description: 'Author ID', required: true })
    @ApiResponse({ status: 200, description: 'Return the note with the specified ID.' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Author ID is missing.' })
    @ApiResponse({ status: 404, description: 'Note not found.' })
    async findOne(@Param('id') id: string, @Headers('x-author-id') authorId: string) {
        this.validateAuthorId(authorId);
        this.logger.log(`Fetching note <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>d</mi></mrow><mi>f</mi><mi>o</mi><mi>r</mi><mi>a</mi><mi>u</mi><mi>t</mi><mi>h</mi><mi>o</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{id} for author </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">a</span><span class="mord mathnormal">u</span><span class="mord mathnormal">t</span><span class="mord mathnormal">h</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span></span></span></span>{authorId}`);
        return this.noteService.findOne(id, authorId);
    }

    /**
     * Update a note
     */
    @Patch('/update/:id')
    @ApiOperation({ summary: 'Update a note' })
    @ApiParam({ name: 'id', description: 'Note ID' })
    @ApiHeader({ name: 'x-author-id', description: 'Author ID', required: true })
    @ApiBody({ type: UpdateNoteDto })
    @ApiResponse({ status: 200, description: 'The note has been successfully updated.' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Author ID is missing.' })
    @ApiResponse({ status: 404, description: 'Note not found.' })
    async update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto, @Headers('x-author-id') authorId: string) {
        this.validateAuthorId(authorId);
        // Verify that the authorId in the header matches the authorId in the DTO
        if (updateNoteDto.authorId !== authorId) {
            this.logger.warn(`Author ID mismatch: header=${authorId}, dto=${updateNoteDto.authorId}`);
            throw new UnauthorizedException('Author ID mismatch');
        }
        this.logger.log(`Updating note <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>d</mi></mrow><mi>f</mi><mi>o</mi><mi>r</mi><mi>a</mi><mi>u</mi><mi>t</mi><mi>h</mi><mi>o</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{id} for author </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">a</span><span class="mord mathnormal">u</span><span class="mord mathnormal">t</span><span class="mord mathnormal">h</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span></span></span></span>{authorId}`);
        return this.noteService.update(id, updateNoteDto, authorId);
    }

    /**
     * Delete a note
     */
    @Delete('/remove/:id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a note' })
    @ApiParam({ name: 'id', description: 'Note ID' })
    @ApiHeader({ name: 'x-author-id', description: 'Author ID', required: true })
    @ApiResponse({ status: 204, description: 'The note has been successfully deleted.' })
    @ApiResponse({ status: 401, description: 'Unauthorized - Author ID is missing.' })
    @ApiResponse({ status: 404, description: 'Note not found.' })
    async remove(@Param('id') id: string, @Headers('x-author-id') authorId: string) {
        this.validateAuthorId(authorId);
        this.logger.log(`Deleting note <span class="katex"><span class="katex-mathml"><math xmlns="http://www.w3.org/1998/Math/MathML"><semantics><mrow><mrow><mi>i</mi><mi>d</mi></mrow><mi>f</mi><mi>o</mi><mi>r</mi><mi>a</mi><mi>u</mi><mi>t</mi><mi>h</mi><mi>o</mi><mi>r</mi></mrow><annotation encoding="application/x-tex">{id} for author </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height:0.8889em;vertical-align:-0.1944em;"></span><span class="mord"><span class="mord mathnormal">i</span><span class="mord mathnormal">d</span></span><span class="mord mathnormal" style="margin-right:0.10764em;">f</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span><span class="mord mathnormal">a</span><span class="mord mathnormal">u</span><span class="mord mathnormal">t</span><span class="mord mathnormal">h</span><span class="mord mathnormal">o</span><span class="mord mathnormal" style="margin-right:0.02778em;">r</span></span></span></span>{authorId}`);
        return this.noteService.remove(id, authorId);
    }

    /**
     * Validate that an author ID is present
           * @param authorId Author identifier
           * @throws UnauthorizedException if authorId is missing
     */
    private validateAuthorId(authorId: string): void {
        if (!authorId) {
            this.logger.warn('Request attempted without author ID');
            throw new UnauthorizedException('Author ID is required');
        }
    }
}
