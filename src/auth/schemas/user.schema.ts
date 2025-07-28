import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true, unique: true })
  usuario: string;

  @Prop({ required: true })
  contrasena: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
