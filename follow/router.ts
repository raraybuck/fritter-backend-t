import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as personaValidator from '../persona/middleware';
import * as followValidator from './middleware';
import * as util from './util';
// import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get all the accounts that this persona follows
 *
 * @name GET /api/follows
 *
 * @return {FollowResponse[]} - A list of all the follows sorted in descending
 *                      order by date followed
 */
/**
 * Get follows by author/initiator (personaId) (aka this person is following X, Y, Z).
 *
 * @name GET /api/follows/:personaId
 *
 * @return {FollowResponse[]} - An array of follows created by persona with id, followerId
 * @throws {400} - If followerId is not given
 * @throws {404} - If no persona has given followerID
 *
 */
 router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) => {
      // Check if followerId (personaId) query parameter was supplied
      if (req.params.personaId !== undefined) {
        next();
        return;
      }
  
      const allFollows = await FollowCollection.findAll();
      const response = allFollows.map(util.constructFollowResponse);
      res.status(200).json(response);
    },

    [
      personaValidator.isPersonaExists
    ],
    async (req: Request, res: Response) => {
      const initiatedFollows = await FollowCollection.findAllInitiatedById(req.query.personaId as string);
      const response = initiatedFollows.map(util.constructFollowResponse);
      res.status(200).json(response);
    }
  );

  export { router as followRouter};