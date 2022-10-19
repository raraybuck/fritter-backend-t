import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Persona} from './model';

// Update this if you add a property to the Persona type!
type PersonaResponse = {
    _id: string;
    user: string;
    handle: string;
    name: string;
};

const constructPersonaResponse = (persona: HydratedDocument<Persona>): PersonaResponse => {
    const personaCopy: Persona = {
      ...persona.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    return {
      ...personaCopy,
      _id: personaCopy._id.toString(),
    };
  };
  
  export {
    constructPersonaResponse
  };