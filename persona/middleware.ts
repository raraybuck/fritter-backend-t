import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from 'user/collection';
import PersonaCollection from '../persona/collection';


/**
 * Checks if a name in req.body is valid, that is, it matches the name regex
*/
const isValidName = (req: Request, res: Response, next: NextFunction) => {
    const nameRegex = /^\w+$/i;
    if (!nameRegex.test(req.body.name)) {
      res.status(400).json({
        error: {
          name: 'Name must be a nonempty alphanumeric string.'
        }
      });
      return;
    }
  
    next();
  };

/**
 * Checks if a handle in req.body is valid, that is, it matches the Fritter handle regex
*/
const isValidHandle = (req: Request, res: Response, next: NextFunction) => {
    const handleRegex = /^\w+$/i;
    if (!handleRegex.test(req.body.handle)) {
      res.status(400).json({
        error: {
          handle: 'Handle must be a nonempty alphanumeric string.'
        }
      });
      return;
    }
  
    next();
  };

/**
 * Checks if a handle in req.body is already in use
*/
const isHandleNotAlreadyInUse = async (req: Request, res: Response, next: NextFunction) => {
    const persona = await PersonaCollection.findOneByHandle(req.body.handle);
  
    // // If the current session user wants to change their username to one which matches
    // // the current one irrespective of the case, we should allow them to do so
    // if (!persona || (persona?._id.toString() === req.session.userId)) {
    //   next();
    //   return;
    // }
  
    res.status(409).json({
      error: {
        username: 'A persona with this Fritter handle already exists.'
      }
    });
  };

/**
 * Checks if a persona with personaId given in req.params exists under a certain user
 */
const isPersonaExistWithUser = async (req: Request, res: Response, next: NextFunction) => {
    const validFormat = Types.ObjectId.isValid(req.params.personaId);
    const persona = validFormat ? await PersonaCollection.findOneByPersonaId(req.params.personaId) : '';
    if (!persona) {
        res.status(400).json({
        error: {
            personaNotFound: `Persona with persona ID ${req.params.personaId} was not found.`
        }
        });
        return;
    }

    if (persona.user !== req.body.user){
        res.status(400).json({
            error: `A persona with Fritter handle ${persona.handle as string} is not associated with the 
            user of username ${req.body.user as string}.`
        });
        return;
    }

    next();
};

/**
 * Checks if a persona with personaId exists.
 */
const isPersonaExists = async (req: Request, res: Response, next: NextFunction) => {
    const persona = await PersonaCollection.findOneByPersonaId(req.body.personaId);
    if (persona) {
        next();
    } else {
        res.status(404).json({error: 'Persona not found.'});
    }
};

  export {
    isValidName,
    isValidHandle,
    isHandleNotAlreadyInUse,
    isPersonaExistWithUser,
    isPersonaExists
  };
  