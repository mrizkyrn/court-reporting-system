import { Router } from 'express';

import jobRoutes from '@/modules/jobs/job.route';
import reporterRoutes from '@/modules/reporters/reporter.route';
import editorRoutes from '@/modules/editors/editor.route';

const router = Router();

router.use('/jobs', jobRoutes);
router.use('/reporters', reporterRoutes);
router.use('/editors', editorRoutes);

export default router;
