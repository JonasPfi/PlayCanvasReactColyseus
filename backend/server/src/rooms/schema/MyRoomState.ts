import { Schema, type } from "@colyseus/schema";

export class MyRoomState extends Schema {

  @type("int32") myRotationSpeed: number = 1;
  @type("int32") myCount: number = 0;

}
