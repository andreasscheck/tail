import { UUID } from '../util/uuid'

export class Job {
  public id: string;
  public user: string;
  public command: string;
  public environment: string;

  constructor(user: string, command: string, env: string) {
    this.id = UUID.uuid();
    this.user = user;
    this.command = command;
    this.environment = env;
  }
}
