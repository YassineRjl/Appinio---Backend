import { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';
import { validationResult } from 'express-validator';
import winston from 'winston';

// We use logit bias here to ban some "AI-cliché" words like: delve, etc... The full list is tokenized below:
// The banned words are => Cannot Tapestry Landscape Delve Dive Beast Uncharted Intriguing Holistic Journey Embark Bask Mere Unfortunately Bastion Zeitgeist Comprehensive Musings Underpinnings Unleash Navigate Nuance Explore Unveil Master Craft Esteemed Crucial Realm cannot tapestry landscape delve dive beast uncharted intriguing holistic journey embark bask mere unfortunately bastion zeitgeist comprehensive musings underpinnings unleash navigate nuance explore unveil master craft esteemed crucial realm
export const OPENAI_BANNED_WORDS = {
    79: -100,
    273: -100,
    290: -100,
    292: -100,
    293: -100,
    321: -100,
    343: -100,
    386: -100,
    426: -100,
    486: -100,
    532: -100,
    588: -100,
    653: -100,
    685: -100,
    826: -100,
    847: -100,
    1003: -100,
    1091: -100,
    1234: -100,
    1252: -100,
    3167: -100,
    4250: -100,
    4633: -100,
    4720: -100,
    5444: -100,
    6258: -100,
    7462: -100,
    7491: -100,
    7623: -100,
    9636: -100,
    11003: -100,
    11060: -100,
    11148: -100,
    11879: -100,
    13488: -100,
    16071: -100,
    16195: -100,
    16809: -100,
    16996: -100,
    17401: -100,
    17902: -100,
    17983: -100,
    18921: -100,
    19173: -100,
    21546: -100,
    22651: -100,
    24969: -100,
    26907: -100,
    27121: -100,
    29931: -100,
    30227: -100,
    30963: -100,
    32236: -100,
    33077: -100,
    33424: -100,
    34282: -100,
    39776: -100,
    41765: -100,
    42206: -100,
    43680: -100,
    45152: -100,
    46168: -100,
    58586: -100,
    61876: -100,
    61894: -100,
    63641: -100,
    67963: -100,
    70531: -100,
    76104: -100,
    78258: -100,
    78535: -100,
    79500: -100,
    82839: -100,
    82845: -100,
    89617: -100,
    91918: -100,
    92131: -100,
    94603: -100,
    97564: -100,
};

/**
 * Middleware function to validate request parameters.
 * @function validateParams
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void}
 * @throws {Object} Returns a 422 status code with an array of validation errors if the request parameters are invalid.
 * @description This middleware function uses the `express-validator` library to validate the request parameters.
 * It checks if there are any validation errors using `validationResult(req)`. If there are errors, it returns a
 * 422 status code with an array of validation errors. If there are no errors, it calls the `next()` function to
 * pass control to the next middleware or route handler.
 */
export function validateParams(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
}

/**
 * Middleware function to reject unknown request parameters.
 * @function rejectUnkownParams
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @param {string[]} allowedKeys - Array of allowed request parameters.
 * @returns {void}
 * @throws {Object} Returns a 422 status code with an error message if the request contains unknown parameters.
 **/

export function rejectUnkownParams(
    req: Request,
    res: Response,
    next: NextFunction,
    allowedKeys: string[],
) {
    for (const key of Object.keys(req.body)) {
        if (!allowedKeys.includes(key)) {
            return res.status(422).json({ message: `Unknown property: ${key}` });
        }
    }
    next();
}
/**
 * Winston logger configuration.
 * @type {Object}
 * @property {Array<Object>} transports - Array of logger transports.
 * @property {Object} transports[0] - Console transport configuration.
 * @property {Object} transports[0].format - Console log format configuration.
 * @property {Object} transports[1] - File transport configuration.
 * @property {string} transports[1].filename - Log file name.
 * @property {Object} transports[1].format - File log format configuration.
 */
export const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
        new winston.transports.File({
            filename: 'combined.log',
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        }),
    ],
});

/**
 * Rate limiter middleware configuration.
 * @type {Object}
 * @property {number} windowMs - Time window in milliseconds (15 minutes).
 * @property {number} limit - Maximum number of requests allowed per IP within the time window.
 * @property {string} standardHeaders - Rate limiting headers standard ('draft-7').
 * @property {boolean} legacyHeaders - Flag to disable legacy 'X-RateLimit-*' headers.
 */
export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
