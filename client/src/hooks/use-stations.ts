import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useStations() {
  return useQuery({
    queryKey: [api.stations.list.path],
    queryFn: async () => {
      const res = await fetch(api.stations.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch stations");
      
      // Parse with Zod schema from shared routes
      return api.stations.list.responses[200].parse(await res.json());
    },
    staleTime: Infinity, // Station data rarely changes
  });
}
