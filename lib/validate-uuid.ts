import { z } from "zod";

export async function isValidUuid(uuid: string): Promise<boolean> {
    return z.uuid().safeParse(uuid).success;
}
