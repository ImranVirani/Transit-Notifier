import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Seed data on startup
  await storage.seedStations();

  app.get(api.stations.list.path, async (req, res) => {
    const result = await storage.getStations();
    res.json(result);
  });

  return httpServer;
}
