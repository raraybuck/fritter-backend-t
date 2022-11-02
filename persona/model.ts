/* eslint-disable no-trailing-spaces */
import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Persona
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Persona on the backend
export type Persona = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: string; //username of the user
  handle: string;
  name: string;
};

// export type PopulatedPersona = {
//   _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
//   user: User; // User object
//   handle: string;
//   name: string;
// };


// Mongoose schema definition for interfacing with a MongoDB table
// Persona stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PersonaSchema = new Schema({
  // The persona's parent user (creator)
  user: {
    type: String, 
    required: true,
    // ref: 'User'
  },
  // The persona's public identifier/handle (should be unique)
  handle: {
    type: String,
    required: true
  },
  // The public name associated with the persona
  name: {
    type: String,
    required: true
  }
});
  
const PersonaModel = model<Persona>('Persona', PersonaSchema);
export default PersonaModel;
  
