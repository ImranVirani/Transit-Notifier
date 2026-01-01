import { db } from "./db";
import { stations, type Station, type InsertStation } from "@shared/schema";

export interface IStorage {
  getStations(): Promise<Station[]>;
  seedStations(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getStations(): Promise<Station[]> {
    return await db.select().from(stations);
  }

  async seedStations(): Promise<void> {
    const existing = await this.getStations();
    if (existing.length === 0) {
      await db.insert(stations).values([
        { name: "Union Station", line: "1", latitude: 43.645575, longitude: -79.380729 },
        { name: "Bloor-Yonge", line: "1/2", latitude: 43.670240, longitude: -79.386864 },
        { name: "St. George", line: "1/2", latitude: 43.668264, longitude: -79.399778 },
        { name: "Spadina", line: "1/2", latitude: 43.667362, longitude: -79.403698 },
        { name: "Kipling", line: "2", latitude: 43.637536, longitude: -79.535554 },
        { name: "Kennedy", line: "2", latitude: 43.732496, longitude: -79.263492 },
        { name: "Finch", line: "1", latitude: 43.780706, longitude: -79.414937 },
        { name: "Vaughan Metro Centre", line: "1", latitude: 43.794163, longitude: -79.527509 },
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
