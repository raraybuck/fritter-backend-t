import type {Request, Response} from 'express';
import express from 'express';
// import FreetCollection from '../freet/collection';
import PersonaCollection from './collection';
import * as userValidator from '../user/middleware';
import * as personaValidator from '../persona/middleware';
import * as util from './util';

const router = express.Router();


/**
 * Create a persona.
 *
 * @name POST /api/persona
 *
 * @param {string} user - username of user
 * @param {string} handle - persona's handle
 * @param {string} name - persona's name
 * @return {PersonaResponse} - The created persona
 * @throws {403} - If there is the user is not logged in
 * @throws {409} - If handle is already taken
 * @throws {400} - If name or handle is not in correct format
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    personaValidator.isValidName,
    personaValidator.isValidHandle,
    personaValidator.isHandleNotAlreadyInUse,
  ],
  async (req: Request, res: Response) => {
    const persona = await PersonaCollection.addOne(req.body.user, req.body.handle, req.body.name);
    res.status(201).json({
      message: `Your persona was created successfully. You are now active as @${persona.handle}`,
      persona: util.constructPersonaResponse(persona)
    });
  }
);

/**
 * Update a user's persona.
 *
 * @name PUT /api/persona/:id
 *
 * @param {string} user - username of the persona's user
 * @param {string} handle - The persona's new password
 * @param {string} name - The persona's new name
 * @return {PersonaRespons} - The updated persona
 * @throws {403} - If user is not logged in
 * @throws {400} - If persona does not exist under the user or could not be found at all
 * @throws {400} - If handle or name are not of the correct format
 * @throws {409} - If handle already taken
 */
router.put(
  '/:personaId?',
  [
    userValidator.isUserLoggedIn,
    personaValidator.isPersonaExistWithUser,
    personaValidator.isValidName,
    personaValidator.isValidHandle,
    personaValidator.isHandleNotAlreadyInUse,
  ],
  async (req: Request, res: Response) => {
    const persona = await PersonaCollection.updateOne(req.params.personaId, req.body);
    res.status(200).json({
      message: 'Your persona was updated successfully.',
      persona: util.constructPersonaResponse(persona)
    });
  }
);

/**
 * Delete a persona.
 *
 * @name DELETE /api/persona/:id
 * 
 * @param {string} personaId - the id of the persona to delete
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the persona with personaId is not found
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    personaValidator.isPersonaExists
  ],
  async (req: Request, res: Response) => {
    await PersonaCollection.deleteOne(req.body.personaId);
    res.status(200).json({
      message: 'Your persona has been deleted successfully.'
    });
  }
);

export {router as personaRouter};
