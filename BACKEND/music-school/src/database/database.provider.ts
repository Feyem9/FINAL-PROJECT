
import * as mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> =>
      await mongoose.connect('mongodb+srv://feyemlionel:Feyem@blog.oxy0qqt.mongodb.net/music-school'),
  },
];
