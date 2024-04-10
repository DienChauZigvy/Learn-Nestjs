import { Message } from 'src/modules/message/schemas/message.schema';
import { User } from 'src/modules/user/schemas/user.schema';

export interface ServerToClientEvents {
  chat: (e: Message) => void;
}

export interface ClientToServerEvents {
  chat: (e: Message) => void;
  joinRoom: (e: { user: User; chatName: string }) => void;
}
