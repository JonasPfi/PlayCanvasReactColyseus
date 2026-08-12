import { Schema, type } from "@colyseus/schema";

export class ChunkState extends Schema {

  @type("string") mySynchronizedProperty: string = "Hello world";

}
