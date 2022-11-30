import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FollowCollection from './collection';
// import * as userValidator from '../user/middleware';
import * as followValidator from './middleware';
import * as util from './util';
// import UserCollection from '../user/collection';

const router = express.Router();

