import { Prop, SchemaFactory, Schema } from "@nestjs/mongoose";
import { HydratedDocument, } from "mongoose";
import { Document } from "mongoose";

export type notificationDocument = HydratedDocument<Notification>;


@Schema({ timestamps: true })
export class Notification extends Document {
    @Prop({ required: true })
    message: string;

    @Prop({ required: true })
    user_id: string;

    @Prop({ required: true })
    title: string;

    @Prop({ default: false })
    read: boolean;

    @Prop()
    event_id: string;
}

export const notificationSchema = SchemaFactory.createForClass(Notification);