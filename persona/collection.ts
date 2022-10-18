import type {HydratedDocument, Types} from 'mongoose';
import type {Persona} from './model';
import PersonaModel from './model';
import type {User} from '../user/model';
import UserCollection from '../user/collection';

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
   * @param {User} user - The User the persona is associated with
   * @param {string} handle - The Fritter handle for the persona
   * @param {string} name - The Persona "name", like J. Doe
   * @return {Promise<HydratedDocument<Persona>>} - The newly created Persona
   */
  static async addOne(user: User, handle: string, name: string): Promise<HydratedDocument<Persona>> {
    const persona = new PersonaModel({user, handle, name});
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
   * @return {Promise<HydratedDocument<Persona>> | Promise<null>} - The persona with the given username, if any
   */
  static async findOneByHandle(handle: string): Promise<HydratedDocument<Persona>> {
    return PersonaModel.findOne({handle: new RegExp(`^${handle.trim()}$`, 'i')});
  }

//     /**
//    * Find a user by username (case insensitive).
//    *
//    * @param {string} username - The username of the user to find
//    * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
//    */
//      static async findOneByUsername(username: string): Promise<HydratedDocument<User>> {
//         return UserModel.findOne({username: new RegExp(`^${username.trim()}$`, 'i')});
//       }

//   /**
//    * Find a user by username (case insensitive).
//    *
//    * @param {string} username - The username of the user to find
//    * @param {string} password - The password of the user to find
//    * @return {Promise<HydratedDocument<User>> | Promise<null>} - The user with the given username, if any
//    */
//   static async findOneByUsernameAndPassword(username: string, password: string): Promise<HydratedDocument<User>> {
//     return UserModel.findOne({
//       username: new RegExp(`^${username.trim()}$`, 'i'),
//       password
//     });
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

    if (personaDetails.handle) {  // TODO: check that the handle is not taken
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
