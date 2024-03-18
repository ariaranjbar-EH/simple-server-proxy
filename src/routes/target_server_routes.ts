import { Router } from "express";
import target_server_controller from "../controllers/target_server_controller";

const router = Router();

router.get("/passthrough/*", target_server_controller.passthrough);

export = router;
