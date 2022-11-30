import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
import * as userValidator from '../user/middleware';
import * as personaValidator from '../persona/middleware';
import * as followValidator from './middleware';
import * as util from './util';
import PersonaCollection from '../persona/collection';
// import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get all Follows of and by the logged in persona.
 *
 * @name GET /api/follows
 *
 * @return {FollowResponse[]} - An array of follows 
 * @throws {403} - If the user is not logged in
 * @throws {403} - If a persona is not signed in 
 *
 */
/**
 * Get all Follows of and by a persona. If personaId is not supplied, uses the logged in persona.
 *
 * @name GET /api/follows?personaId=id
 *
 * @return {FollowResponse[]} - An array of follows 
 * @throws {400} - If a personaId is not supplied (empty)
 * @throws {403} - If the user is not logged in or If a persona is not signed in 
 * @throws {404} - If the persona doesn't exist/can't be found
 *
 */
router.get(
    '/',
    // Case without query (where personaId was not supplied), checking own info
    [
        userValidator.isUserLoggedIn,
        personaValidator.isPersonaSignedIn
    ], 
    async (req: Request, res: Response, next: NextFunction) => {
        // Check if authorId query parameter was not supplied
        if (req.query.personaId !== undefined) {
            next();
            return;
        } 
        console.log("query not supplied");
        const following = await FollowCollection.findAllInitiatedById(req.session.personaId);
        const followers = await FollowCollection.findAllReceivedById(req.session.personaId);
        res.status(200).json({
            persona: req.session.personaID,
            following: following.map(util.constructFollowResponse),
            followers: followers.map(util.constructFollowResponse),
        });
    }, 

    // Case with query (where personaId was supposedly supplied) (for different user)
    [
        userValidator.isUserLoggedIn,
        personaValidator.isPersonaSignedIn,
        personaValidator.isPersonaQueryExists
    ], 
    async (req: Request, res: Response) => {
        console.log("query supplied");
        const following = await FollowCollection.findAllInitiatedById(req.query.personaId as string);
        const followers = await FollowCollection.findAllReceivedById(req.query.personaId as string);
        res.status(200).json({
            persona: req.query.personaId as string,
            following: following.map(util.constructFollowResponse),
            followers: followers.map(util.constructFollowResponse),
        });
      }
);


/**
 * Get all the Follows that the logged in persona initiated (Following list)
 *
 * @name GET /api/follows/following
 *
 * @return {FollowResponse[]} - A list of all the follows sorted in descending
 *                      order by date followed
 * @throws {403} - If the user is not logged in
 * @throws {403} - If a persona is not signed in 
 */
router.get(
    '/following',
    [   
        userValidator.isUserLoggedIn,
        personaValidator.isPersonaSignedIn
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const followerId = req.session.personaId;
        const allFollowing = await FollowCollection.findAllInitiatedById(followerId);
        const response = allFollowing.map(util.constructFollowResponse);
        res.status(200).json(response);
    },
);

/**
 * Get all the Follows that the logged in persona received (Followers list)
 *
 * @name GET /api/follows/followers
 *
 * @return {FollowResponse[]} - A list of all the follows sorted in descending
 *                      order by date followed
 * @throws {403} - If the user is not logged in
 * @throws {403} - If a persona is not signed in 
 */
router.get(
    '/followers',
    [   
        userValidator.isUserLoggedIn,
        personaValidator.isPersonaSignedIn
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        const followingId = req.session.personaId;
        const allFollowers = await FollowCollection.findAllReceivedById(followingId);
        const response = allFollowers.map(util.constructFollowResponse);
        res.status(200).json(response);
    }, 
);

/**
 * Create a new follow.
 *
 * @name POST /api/follows
 *
 * @param {string} personaId - The id of the persona being followed
 * @return {FollowResponse} - The created follow
 * @throws {403} - If the user is not logged in
 * @throws {403} - If the user is not currently signed in with a persona
 * @throws {404} - If the persona to be followed does not exist
 */
 router.post(
    '/',
    [
      userValidator.isUserLoggedIn,
      personaValidator.isPersonaSignedIn,
      personaValidator.isPersonaExists
    ],
    async (req: Request, res: Response) => {
      const followerId = (req.session.personaId as string) ?? ''; // Will not be an empty string since its validated in isPersonaSignedIn
      const follow = await (await FollowCollection.addOne(followerId, req.body.followingId)).populate(["followerId", "followingId"]);
      res.status(201).json({
        message: `You have successfully followed the account ${follow.followingId}.`,
        freet: util.constructFollowResponse(follow)
      });
    }
  );

  export { router as followRouter};