import * as express from 'express';
import { create as createUrlValidation, read as readUrlValidation } from '../../validations/url';
import { create as createUrlController, read as readUrlController, fetchUtls as fetchUtlsController } from '../../controllers/url';

const router: express.Router = express.Router();

router.get('/', fetchUtlsController);
router.post('/', createUrlValidation, createUrlController);
router.get('/:id', readUrlValidation, readUrlController);

export default router;
