/* eslint-disable capitalized-comments */
import type {HydratedDocument, Types} from 'mongoose';
import type {Persona} from './model';
import PersonaModel from './model';
// import type {User} from '../user/model';
// import UserCollection from '../user/collection';

/**
 * This file contains a class with functionality to interact with personas stored
 * in MongoDB, including adding, finding, updating, and deleting.
 *
 * Note: HydratedDocument<Persona> is the output of the PersonaModel() constructor,
 * and contains all the information in Persona. https://mongoosejs.com/docs/typescript.html
 */
class PersonaCollection {
  /**
   * Add a new persona
   *
   * @param {string} username - The username of the User the persona is associated with
   * @param {string} handle - The Fritter handle for the persona
   * @param {string} name - The Persona "name", like J. Doe
   * @return {Promise<HydratedDocument<Persona>>} - The newly created Persona
   */
  static async addOne(username: string, handle: string, name: string): Promise<HydratedDocument<Persona>> {
    const persona = new PersonaModel({user: username, handle, name});
    await persona.save(); // Saves user to MongoDB
    return persona;
  }

  /**
   * Find a persona by personaId.
   *
   * @param {string} personaId - The personaId of the persona to find
   * @return {Promise<HydratedDocument<Persona>> | Promise<null>} - The persona with the given personaId, if any
   */
  static async findOneByPersonaId(personaId: Types.ObjectId | string): Promise<HydratedDocument<Persona>> {
    return PersonaModel.findOne({_id: personaId});
  }

  /**
   * Find a persona by handle (case insensitive).
   *
   * @param {string} handle - The handle of the persona to find
   * @return {Promise<HydratedDocument<Persona>> | Promise<null>} - The persona with the given handle, if any
   */
  static async findOneByHandle(handle: string): Promise<HydratedDocument<Persona>> {
    return PersonaModel.findOne({handle: new RegExp(`^${handle.trim()}$`, 'i')}); // i flag means case insensitive
  }

  /**
   * Find persona by user and persona name (case insensitive).
   *
   * @param {string} username - The username of the User to look under
   * @param {string} name - the name of the persona
   * @return {Promise<HydratedDocument<Persona>> | Promise<null>} - The persona with the given name and User, if any
   */
  static async findOneByUserAndName(username: string, name: string): Promise<HydratedDocument<Persona>> {
    return PersonaModel.findOne({user: new RegExp(`^${username.trim()}$`, 'i'), name: new RegExp(`^${name.trim()}$`, 'i')
    });
  }

  /**
   * Find a list of all personas under a user (username)
   *
   * @param {string} username - The username the personas are associated with
   * @return {Promise<HydratedDocument<Persona>>[]} - The personas of the given user(name)
   */
  static async findManyByUsername(username: string): Promise<Array<HydratedDocument<Persona>>> {
    return PersonaModel.find({ user: new RegExp(`^${username.trim()}$`, 'i'),
    });
  }

//   /**
//  * Find a list of all personas under a user (username)
//  *
//  * @param {string} username - The username of author of the freets
//  * @return {Promise<HydratedDocument<Persona>[]>} - An array of all of the personas
//  */
//   static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Persona>>> {
//     const author = await UserCollection.findOneByUsername(username);
//     return PersonaModel.find({authorId: author._id}).populate('authorId');
//   }

  /**
   * Update persona's information (i.e. name, handle)
   *
   * @param {string} personaId - The personaId of the persona to update
   * @param {Object} personaDetails - An object with the persona's updated credentials
   * @return {Promise<HydratedDocument<Persona>>} - The updated persona
   */
  static async updateOne(personaId: Types.ObjectId | string, personaDetails: any): Promise<HydratedDocument<Persona>> {
    const persona = await PersonaModel.findOne({_id: personaId});
    if (personaDetails.name) {
      persona.name = personaDetails.name as string;
    }

    if (personaDetails.handle) { 
      persona.handle = personaDetails.handle as string;
    }

    await persona.save();
    return persona;
  }

  /**
   * Delete a persona from the collection.
   *
   * @param {string} personaId - The personaId of persona to delete
   * @return {Promise<Boolean>} - true if the persona has been deleted, false otherwise
   */
  static async deleteOne(personaId: Types.ObjectId | string): Promise<boolean> {
    const persona = await PersonaModel.deleteOne({_id: personaId});
    return persona !== null;
  }
}

export default PersonaCollection;
